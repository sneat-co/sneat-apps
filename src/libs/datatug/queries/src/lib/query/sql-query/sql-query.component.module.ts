import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { DatatugComponentsDatagridModule } from '@sneat/datatug/components/datagrid';
import { DatatugExecutorModule } from '@sneat/datatug/executor';
import { DatatugComponentsSqlEditorModule } from '@sneat/datatug/components/sqleditor';
import { DatatugQueriesServicesModule } from '../../datatug-queries-services.module';
// import { WormholeModule } from "@sneat/wormhole"; // was causing error NG6002
import { DatatugComponentsParametersModule } from '@sneat/datatug/components/parameters';
import { DatatugBoardUiModule } from '@sneat/datatug/board/ui';

import { SqlQueryEditorComponent } from './sql-query-editor.component';
import { ColumnsComponent } from './query-builder/columns.component';
import { JoinsComponent } from './query-builder/joins.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		CodemirrorModule,
		// WormholeModule,
		DatatugComponentsSqlEditorModule,
		DatatugQueriesServicesModule,
		DatatugExecutorModule,
		DatatugComponentsDatagridModule,
		DatatugComponentsParametersModule,
		DatatugBoardUiModule,
	],
	exports: [
		SqlQueryEditorComponent,
	],
	declarations: [
		SqlQueryEditorComponent,
		ColumnsComponent,
		JoinsComponent,
	],
})
export class SqlQueryComponentModule {
}
