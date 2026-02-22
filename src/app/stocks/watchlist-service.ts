import { inject, Injectable } from '@angular/core';
import { createLocalStorageSignal } from '../storage';
import {
  QuoteResponse,
  quoteResponseSchema,
  SymbolEntry,
  symbolEntrySchema,
  tickerDataMessageSchema,
} from '../schemas/finnhub';
import { HttpClient } from '@angular/common/http';
import { z } from 'zod';
import { StockService } from './stock-service';

const savedSymbolSchema = symbolEntrySchema.extend({
  quote: z.object({
    price: z.number(),
    change: z.number().optional().nullable(),
    changePercent: z.number().optional().nullable(),
  }),
});

export type SavedSymbol = z.infer<typeof savedSymbolSchema>;

function createSavedSymbol(symbol: SymbolEntry, quote: QuoteResponse): SavedSymbol {
  return {
    ...symbol,
    quote: {
      price: quote.c,
      change: quote.d,
      changePercent: quote.dp,
    },
  };
}
@Injectable({
  providedIn: 'root',
})
export class WatchlistService {
  stockService = inject(StockService);
  watchlist = createLocalStorageSignal('watchlist', [], savedSymbolSchema.array());
  socket: WebSocket | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.socket = new WebSocket(`/ws`);
    }
  }

  addSymbol(symbol: SymbolEntry) {
    this.stockService.getQuote(symbol.symbol).subscribe((quote) => {
      this.watchlist.update((symbols) => {
        return symbols
          .filter((s) => s.symbol !== symbol.symbol)
          .concat(createSavedSymbol(symbol, quote));
      });
    });
  }
  removeSymbol(symbol: string) {
    this.watchlist.update((symbols) => symbols.filter((s) => s.symbol !== symbol));
  }
  refreshQuotes() {
    this.watchlist().forEach((symbol) => {
      this.stockService.getQuote(symbol.symbol).subscribe((quote) => {
        this.watchlist.update((symbols) =>
          symbols.map((s) => (s.symbol === symbol.symbol ? createSavedSymbol(s, quote) : s)),
        );
      });
    });
  }
  subscribeToWatchlist() {
    this.socket?.addEventListener('message', this.handleMessage);
    this.socket?.addEventListener('open', (event) => {
      console.log('Socket opened', event);
      this.watchlist().forEach((symbol) => {
        this.socket?.send(JSON.stringify({ type: 'subscribe', symbol: symbol.symbol }));
      });
    });
  }
  unsubscribeFromWatchlist() {
    this.watchlist().forEach((symbol) => {
      this.socket?.send(JSON.stringify({ type: 'unsubscribe', symbol: symbol.symbol }));
    });
  }

  handleMessage(event: MessageEvent) {
    try {
      const parsedData = tickerDataMessageSchema.safeParse(JSON.parse(event.data));
      if (!parsedData.success) {
        console.error('Error parsing message from server', parsedData.error);
        return;
      }
      const message = parsedData.data;
      switch (message.type) {
        case 'trade':
          message.data.forEach((data) => {
            this.watchlist.update((symbols) =>
              symbols.map((s) => (s.symbol === data.s ? { ...s, price: data.p } : s)),
            );
          });
          break;
        case 'ping':
          console.log('Ping from server', message);
          break;
        default:
          console.error('Unknown message type', message);
          break;
      }
    } catch (error) {
      console.error('Error parsing message from server', error);
    }
    console.log('Message from server ', event.data);
  }
}
