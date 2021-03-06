import {NgModule} from '@angular/core';
import {SchemaService} from './schema.service';
import {EntityService} from './entity.service';
import {DbServerService} from './db-server.service';
import {EnvironmentService} from './environment.service';
import {ProjectItemServiceFactory} from './project-item-service';
import {QueriesService} from './queries.service';
import {RecordsetService} from './recordset.service';
import {VariableService} from './variable.service';
import {TableService} from './table.service';
import {QueryContextSqlService} from './query-context-sql.service';
import {SneatAuthModule} from "@sneat/auth";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  imports: [
    HttpClientModule,
    SneatAuthModule,
  ],
  providers: [
    DbServerService,
    EntityService,
    EnvironmentService,
    ProjectItemServiceFactory,
    QueriesService,
    RecordsetService,
    SchemaService,
    VariableService,
    TableService,
    QueryContextSqlService,
  ]
})
export class DatatugServicesUnsortedModule {
}
