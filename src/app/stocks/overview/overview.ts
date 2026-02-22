import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { marketOverviewSchema } from '../../schemas/finnhub';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { WatchlistService } from '../watchlist-service';
import { SymbolEntry } from '../../schemas/finnhub';

@Component({
  selector: 'app-overview',
  imports: [CurrencyPipe],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {
  router = inject(Router);
  watchlistService = inject(WatchlistService);
  marketOverview = httpResource(
    () => {
      return '/api/overview';
    },
    {
      parse: marketOverviewSchema.parse,
    },
  );

  ngOnInit() {
    console.log('marketOverview', this.marketOverview.value());
  }
  onSelectSymbol(symbol: SymbolEntry) {
    this.watchlistService.addSymbol(symbol);
    this.router.navigate(['/symbol', symbol.symbol]);
  }
}
