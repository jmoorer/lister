import { Component, computed, inject, resource } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockService } from '../stock-service';
import { forkJoin, map, shareReplay } from 'rxjs';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

//format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
@Component({
  selector: 'app-stock-details',
  imports: [DatePipe],
  templateUrl: './stock-details.html',
  styleUrl: './stock-details.css',
})
export class StockDetails {
  private activatedRoute = inject(ActivatedRoute);
  stockService = inject(StockService);
  routeParams = toSignal(this.activatedRoute.params);
  currentSymbol = computed<string>(() => this.routeParams()?.['symbol'] ?? '');

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      console.log('pageparams', params['symbol']);
    });
  }

  marketStatus = this.stockService.getMarketStatus();
  stockDetails = rxResource({
    params: () => ({ symbol: this.currentSymbol() }),
    stream: ({ params }) => {
      const { symbol } = params;
      const oneWeekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24);
      const from = formatDate(oneWeekAgo);
      const to = formatDate(new Date());
      console.log(from, to);
      return forkJoin([
        this.stockService.getCompanyProfile(symbol),
        this.stockService.getQuote(symbol),
        this.stockService.getNews(symbol, from, to),
      ]).pipe(
        shareReplay(1),
        map(([profile, quote, news]) => {
          return {
            profile,
            quote: {
              price: quote.c,
              change: quote.d,
              changePercent: quote.dp,
              high: quote.h,
              low: quote.l,
              open: quote.o,
              previousClose: quote.pc,
              timestamp: quote.t,
            },
            news,
          };
        }),
      );
    },
  });

  ngOnInit() {
    console.log('currentSymbol', this.currentSymbol());
  }
}
