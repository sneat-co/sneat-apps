import {NgModule} from '@angular/core';
import {ProjectService} from './project.service';
import {ProjectContextService} from './project-context.service';

@NgModule({
  imports: [],
  providers: [
    ProjectService,
    ProjectContextService,
  ]
})
export class DatatugServicesProjectModule {
}
