import {NgModule} from '@angular/core';
import {SchemaService} from './schema.service';
import {EntityService} from './entity.service';
import {DbServerService} from './db-server.service';
import {EnvironmentService} from './environment.service';
import {RecordsetService} from './recordset.service';
import {VariableService} from './variable.service';
import {TableService} from './table.service';
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
		// EnvironmentService,
		RecordsetService,
		SchemaService,
		VariableService,
		TableService,
	]
})
export class DatatugServicesUnsortedModule {
}
