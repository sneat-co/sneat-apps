import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatugHomePage } from './datatug-home-page.component';

const routes: Routes = [
  {
    path: '',
    component: DatatugHomePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
