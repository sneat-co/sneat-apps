import {NgModule} from '@angular/core';
import {SchemaService} from './schema.service';
import {EntityService} from './entity.service';
import {DbServerService} from './db-server.service';
import {RecordsetService} from './recordset.service';
import {VariableService} from './variable.service';
import {TableService} from './table.service';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
	imports: [
		HttpClientModule,
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
