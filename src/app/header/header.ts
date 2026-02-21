import { Component, inject } from '@angular/core';
import { StockSearch } from '../stocks/stock-search/stock-search';
import { StockService } from '../stocks/stock-service';

@Component({
  selector: 'app-header',
  imports: [StockSearch],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  stockService = inject(StockService);
  marketStatus = this.stockService.getMarketStatus();
}
