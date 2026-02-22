import 'dotenv/config';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join } from 'node:path';
import type { Request, Response, NextFunction } from 'express';
import { Socket } from 'net';
import { QuoteResponse } from './app/schemas/finnhub';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Proxy middleware for the Finnhub API
const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'https://finnhub.io/api/v1',
  changeOrigin: true,
  pathRewrite: {
    '^/finnhub': '',
  },
  headers: {
    'X-Finnhub-Token': process.env['FINNHUB_API_KEY'] || '',
  },
});

const wsProxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'wss://ws.finnhub.io',
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/ws': '',
  },
  headers: {
    'X-Finnhub-Token': process.env['FINNHUB_API_KEY'] || '',
  },
});

const finnhubFetcher = async <T>(path: string): Promise<T> => {
  return fetch(`https://finnhub.io/api/v1${path}`, {
    headers: {
      'X-Finnhub-Token': process.env['FINNHUB_API_KEY'] || '',
    },
  }).then((response) => response.json());
};
// Market symbols for the overview
const MARKET_SYMBOLS = [
  { symbol: 'SPY', name: 'S&P 500', description: 'SPDR S&P 500 ETF' },
  { symbol: 'QQQ', name: 'Nasdaq 100', description: 'Invesco QQQ Trust' },
  { symbol: 'DIA', name: 'Dow Jones', description: 'SPDR Dow Jones ETF' },
  { symbol: 'IWM', name: 'Russell 2000', description: 'iShares Russell 2000' },
];
app.get('/api/overview', async (req, res) => {
  const symbols = await Promise.all(
    MARKET_SYMBOLS.map(async (symbol) => {
      const quote = await finnhubFetcher<QuoteResponse>(`/quote?symbol=${symbol.symbol}`);
      return {
        symbol: symbol.symbol,
        name: symbol.name,
        description: symbol.description,
        quote: {
          price: quote.c,
          change: quote.d,
          changePercent: quote.dp,
        },
      };
    }),
  );
  res.json({
    symbols,
  });
});

app.use('/finnhub', proxyMiddleware);

app.use('/ws', wsProxyMiddleware);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  const nodeServer = app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
  nodeServer.on('upgrade', (req, socket: Socket, head) => {
    if (req.url?.startsWith('/ws')) {
      wsProxyMiddleware.upgrade(req, socket, head);
    }
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
