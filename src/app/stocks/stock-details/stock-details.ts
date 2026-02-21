import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stock-details',
  imports: [],
  templateUrl: './stock-details.html',
  styleUrl: './stock-details.css',
})
export class StockDetails {
  private activatedRoute = inject(ActivatedRoute);
  currentSymbol = computed(() => this.activatedRoute.snapshot.params['symbol']);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      console.log('pageparams', params['symbol']);
    });
  }
  ngOnInit() {}
}
