import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlQueryPageRoutingModule} from './sql-query-routing.module';

import {SqlQueryPageComponent} from './sql-query-page.component';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugExecutorModule} from '@sneat/datatug/executor';
import {DatatugComponentsSqlEditorModule} from '@sneat/datatug/components/sqleditor';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';
import {DatatugQueriesModule} from "@sneat/datatug/queries";
import {ColumnsComponent} from "./columns.component";
import {JoinsComponent} from "./joins.component";
import {WormholeModule} from "@sneat/wormhole";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsSqlEditorModule,
		SqlQueryPageRoutingModule,
		CodemirrorModule,
		QueriesServiceModule,
		DatatugBoardModule,
		DatatugExecutorModule,
		DatatugComponentsDatagridModule,
		DatatugQueriesModule,
		WormholeModule,
	],
	declarations: [
		SqlQueryPageComponent,
		ColumnsComponent,
		JoinsComponent,
	]
})
export class SqlQueryPageModule {
}
