import { Component, inject } from '@angular/core';
import { WatchList } from '../watch-list/watch-list';
import { Router, RouterOutlet } from '@angular/router';
import { WatchlistService } from '../watchlist-service';
import { Overview } from '../overview/overview';
@Component({
  selector: 'app-dashboard',
  imports: [WatchList, RouterOutlet, Overview],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  watchlistService = inject(WatchlistService);
  symbolEntries = this.watchlistService.watchlist;

  constructor(private router: Router) {}

  isHomeRoute() {
    return this.router.url === '/';
  }

  ngOnInit() {
    console.log('symbolEntries', this.symbolEntries());
    this.watchlistService.subscribeToWatchlist();
  }
  ngOnDestroy() {
    this.watchlistService.unsubscribeFromWatchlist();
  }
  removeSymbol(symbol: string) {
    this.watchlistService.removeSymbol(symbol);
    const currentSymbol = this.router.url.split('/').pop();
    const updatedSymbolEntries = this.symbolEntries();
    if (updatedSymbolEntries.length === 0) {
      this.router.navigate(['/']);
    } else if (currentSymbol === symbol) {
      this.router.navigate(['/symbol', updatedSymbolEntries[0].symbol]);
    }
  }
}
