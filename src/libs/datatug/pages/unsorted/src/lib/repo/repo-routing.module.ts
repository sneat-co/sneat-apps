import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RepoPageComponent} from './repo-page.component';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: RepoPageComponent,
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
