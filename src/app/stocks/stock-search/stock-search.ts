import { Component, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SymbolEntry } from '../../schemas/finnhub';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StockService } from '../stock-service';
import { WatchlistService } from '../watchlist-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stock-search',
  imports: [FormsModule],
  templateUrl: './stock-search.html',
  styleUrl: './stock-search.css',
})
export class StockSearch {
  searchQuery = signal<string>('');
  stockService = inject(StockService);
  watchlistService = inject(WatchlistService);
  router = inject(Router);

  debouncedTerm = toSignal(
    toObservable(this.searchQuery).pipe(
      // filter((value) => value.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  searchResults = this.stockService.lookupSymbol(this.debouncedTerm);

  addSymbol(symbol: SymbolEntry) {
    console.log('addSymbol', symbol);
    this.router.navigate(['/symbol', symbol.symbol]);
    this.watchlistService.addSymbol(symbol);
    this.searchQuery.set('');
  }
}
