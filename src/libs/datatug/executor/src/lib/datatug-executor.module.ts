import {NgModule} from '@angular/core';
import {DatatugServicesRepoModule} from '@sneat/datatug/services/repo';
import {Coordinator} from './coordinator';

@NgModule({
  imports: [
    DatatugServicesRepoModule,
  ],
  providers: [
    Coordinator,
  ]
})
export class DatatugExecutorModule {
}
