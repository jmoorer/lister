import { Routes } from '@angular/router';
import { PostList } from './post-list/post-list';
import { PostDetails } from './post-details/post-details';

import { Dashboard } from './stocks/dashboard/dashboard';
import { StockDetails } from './stocks/stock-details/stock-details';
export const routes: Routes = [
  {
    path: '',
    component: Dashboard,
    children: [
      {
        path: 'symbol/:symbol',
        component: StockDetails,
      },
    ],
  },
  {
    path: 'post/:id',
    component: PostDetails,
  },
];
