import { Component, effect, EventEmitter, inject, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SymbolEntry } from '../../schemas/finnhub';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, filter } from 'rxjs';
import { distinctUntilChanged } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { StockService } from '../stock-service';
import { WatchlistService } from '../watchlist-service';
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

  debouncedTerm = toSignal(
    toObservable(this.searchQuery).pipe(
      // filter((value) => value.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  // 3. The resource automatically fetches when debouncedTerm changes
  searchResults = this.stockService.lookupSymbol(this.debouncedTerm);

  log() {
    console.log('log');
  }

  addSymbol(symbol: SymbolEntry) {
    console.log('addSymbol', symbol);
    this.watchlistService.addSymbol(symbol);
    this.searchQuery.set('');
  }
}
