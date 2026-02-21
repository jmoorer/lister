import { Injectable, Signal } from '@angular/core';
import { z } from 'zod';
import { createLocalStorageSignal } from '../storage';
import { marketStatusSchema, quoteResponseSchema, searchResultsSchema } from '../schemas/finnhub';
import { httpResource } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  lookupSymbol(query: Signal<string>) {
    return httpResource(
      () => {
        const term = query().trim();
        if (!term) {
          return;
        }
        return `/finnhub/search?q=${term}&exchange=US`;
      },
      {
        parse: searchResultsSchema.parse,
      },
    );
  }
  getMarketStatus() {
    return httpResource(
      () => {
        return `/finnhub/stock/market-status?exchange=US`;
      },
      {
        parse: marketStatusSchema.parse,
      },
    );
  }
}
