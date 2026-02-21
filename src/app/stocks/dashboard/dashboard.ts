import { Component, inject } from '@angular/core';
import { WatchList } from '../watch-list/watch-list';
import { RouterOutlet } from '@angular/router';
import { WatchlistService } from '../watchlist-service';
@Component({
  selector: 'app-dashboard',
  imports: [WatchList, RouterOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  watchlistService = inject(WatchlistService);
  symbolEntries = this.watchlistService.watchlist;

  ngOnInit() {
    console.log('symbolEntries', this.symbolEntries());
    this.watchlistService.subscribeToWatchlist();
  }
  ngOnDestroy() {
    this.watchlistService.unsubscribeFromWatchlist();
  }
  removeSymbol(symbol: string) {
    this.watchlistService.removeSymbol(symbol);
  }
}
