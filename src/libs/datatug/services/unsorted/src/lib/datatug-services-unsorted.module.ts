import {NgModule} from '@angular/core';
import {SchemaService} from './schema.service';
import {EntityService} from './entity.service';
import {DbServerService} from './db-server.service';
import {EnvironmentService} from './environment.service';
import {ProjectItemService, ProjectItemServiceFactory} from './project-item-service';
import {QueriesService} from './queries.service';
import {RecordsetService} from './recordset.service';
import {VariableService} from './variable.service';

@NgModule({
  imports: [],
  providers: [
    DbServerService,
    EntityService,
    EnvironmentService,
    ProjectItemServiceFactory,
    QueriesService,
    RecordsetService,
    SchemaService,
    VariableService,
  ]
})
export class DatatugServicesUnsortedModule {
}
