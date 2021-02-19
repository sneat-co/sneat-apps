import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RepoPage} from './repo.page';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: RepoPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class RepoPageRoutingModule {
}
