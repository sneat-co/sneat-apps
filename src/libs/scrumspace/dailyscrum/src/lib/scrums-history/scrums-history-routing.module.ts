import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ScrumsHistoryPage} from './scrums-history.page';

const routes: Routes = [
  {
    path: '',
    component: ScrumsHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScrumsHistoryPageRoutingModule {
}
