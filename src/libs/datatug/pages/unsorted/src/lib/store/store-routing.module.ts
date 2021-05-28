import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StorePageComponent} from './store-page.component';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: StorePageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class StorePageRoutingModule {
}
