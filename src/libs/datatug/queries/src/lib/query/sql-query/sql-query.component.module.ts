import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlQueryEditorComponent} from './sql-query-editor.component';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugExecutorModule} from '@sneat/datatug/executor';
import {DatatugComponentsSqlEditorModule} from '@sneat/datatug/components/sqleditor';
import {DatatugQueriesServicesModule} from '../../datatug-queries-services.module';
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
		DatatugQueriesServicesModule,
		DatatugBoardModule,
		DatatugExecutorModule,
		DatatugComponentsDatagridModule,
		WormholeModule,
		DatatugComponentsParametersModule,
	],
	exports: [
		SqlQueryEditorComponent
	],
	declarations: [
		SqlQueryEditorComponent,
		ColumnsComponent,
		JoinsComponent,
	]
})
export class SqlQueryComponentModule {
}
