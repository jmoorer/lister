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

  private activatedRoute = inject(ActivatedRoute);
  currentSymbol = computed(() => this.activatedRoute.snapshot.params['symbol']);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params['symbol']);
    });
  }
  ngOnInit() {}
  onRemoveSymbol(symbol: string) {
    this.onRemoveSymbolEvent.emit(symbol);
  }
  navigateToSymbol(symbol: string) {
    this.router.navigate(['symbol', symbol]);
  }
}
