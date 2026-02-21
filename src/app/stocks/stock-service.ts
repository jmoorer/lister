import { Injectable, Signal } from '@angular/core';
import { z } from 'zod';
import { createLocalStorageSignal } from '../storage';
import {
  FINHUB_CONFIG,
  marketStatusSchema,
  quoteResponseSchema,
  searchResultsSchema,
} from '../finhub';
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
        return `${FINHUB_CONFIG.baseUrl}/search?q=${term}&exchange=US&token=${FINHUB_CONFIG.token}`;
      },
      {
        parse: searchResultsSchema.parse,
      },
    );
  }
  getMarketStatus() {
    return httpResource(
      () => {
        return `${FINHUB_CONFIG.baseUrl}/stock/market-status?exchange=US&token=${FINHUB_CONFIG.token}`;
      },
      {
        parse: marketStatusSchema.parse,
      },
    );
  }
}
