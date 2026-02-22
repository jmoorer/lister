import { Component, computed, inject, input, output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SymbolEntry } from '../../schemas/finnhub';
import { SavedSymbol } from '../watchlist-service';
@Component({
  selector: 'app-watch-list',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './watch-list.html',
  styleUrl: './watch-list.css',
})
export class WatchList {
  symbolEntries = input.required<SavedSymbol[]>({});
  onRemoveSymbolEvent = output<string>();
  router = inject(Router);

  ngOnInit() {
    console.log('init watch list 3');
  }
  onRemoveSymbol(event: MouseEvent, symbol: string) {
    event.stopPropagation();
    this.onRemoveSymbolEvent.emit(symbol);
  }
}
