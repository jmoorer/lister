import { inject, Injectable, Signal } from '@angular/core';
import { z } from 'zod';
import { createLocalStorageSignal } from '../storage';
import {
  CompanyProfile,
  companyProfileSchema,
  marketStatusSchema,
  NewsResponse,
  newsResponseSchema,
  QuoteResponse,
  quoteResponseSchema,
  searchResultsSchema,
} from '../schemas/finnhub';
import { HttpClient, httpResource } from '@angular/common/http';
import { forkJoin, map, shareReplay } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { isEmptyObject } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class StockService {
  http = inject(HttpClient);
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
  getCompanyProfile(symbol: string) {
    return this.http
      .get<CompanyProfile>(`/finnhub/stock/profile2?symbol=${symbol}`)
      .pipe(
        map((profile) =>
          isEmptyObject(profile) ? undefined : companyProfileSchema.parse(profile),
        ),
      );
  }
  getQuote(symbol: string) {
    return this.http
      .get<QuoteResponse>(`/finnhub/quote?symbol=${symbol}`)
      .pipe(map((quote) => quoteResponseSchema.parse(quote)));
  }
  getNews(symbol: string, from: string, to: string) {
    return this.http
      .get<NewsResponse>(`/finnhub/company-news?symbol=${symbol}&from=${from}&to=${to}`)
      .pipe(map((news) => newsResponseSchema.parse(news)));
  }
}
