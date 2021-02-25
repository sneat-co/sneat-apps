import {NgModule} from '@angular/core';
import {ProjectService} from './project.service';
import {ProjectContextService} from './project-context.service';
import {PrivateTokenStoreModule, PrivateTokenStoreService} from '@sneat/datatug/services/unsorted';

@NgModule({
  imports: [
    PrivateTokenStoreModule
  ],
  providers: [
    ProjectService,
    ProjectContextService,
    PrivateTokenStoreService,
  ]
})
export class DatatugServicesProjectModule {
}
