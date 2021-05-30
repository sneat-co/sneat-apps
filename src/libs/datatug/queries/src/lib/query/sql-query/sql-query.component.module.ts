import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlQueryComponent} from './sql-query.component';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugExecutorModule} from '@sneat/datatug/executor';
import {DatatugComponentsSqlEditorModule} from '@sneat/datatug/components/sqleditor';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';
import {DatatugQueriesModule} from "@sneat/datatug/queries";
import {ColumnsComponent} from "./query-builder/columns.component";
import {JoinsComponent} from "./query-builder/joins.component";
import {WormholeModule} from "@sneat/wormhole";
import {DatatugComponentsParametersModule} from "@sneat/datatug/components/parameters";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsSqlEditorModule,
		CodemirrorModule,
		QueriesServiceModule,
		DatatugBoardModule,
		DatatugExecutorModule,
		DatatugComponentsDatagridModule,
		DatatugQueriesModule,
		WormholeModule,
		DatatugComponentsParametersModule,
	],
	exports: [
		SqlQueryComponent
	],
	declarations: [
		SqlQueryComponent,
		ColumnsComponent,
		JoinsComponent,
	]
})
export class SqlQueryComponentModule {
}
