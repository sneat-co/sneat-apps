import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatugHomePageComponent } from './datatug-home-page.component';

const routes: Routes = [
  {
    path: '',
    component: DatatugHomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
