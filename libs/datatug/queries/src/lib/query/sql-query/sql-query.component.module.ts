import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { DataGridComponent } from '@sneat/datagrid';
import { DatatugExecutorModule } from '@sneat/ext-datatug-executor';
import { DatatugComponentsSqlEditorModule } from '@sneat/ext-datatug-components-sqleditor';
import { DatatugQueriesServicesModule } from '../../datatug-queries-services.module';
// import { WormholeModule } from "@sneat/wormhole"; // was causing error NG6002
import { DatatugComponentsParametersModule } from '@sneat/ext-datatug-components-parameters';
import { DatatugBoardUiModule } from '@sneat/ext-datatug-board-ui';

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
		DataGridComponent,
		DatatugComponentsParametersModule,
		DatatugBoardUiModule,
	],
	exports: [SqlQueryEditorComponent],
	declarations: [SqlQueryEditorComponent, ColumnsComponent, JoinsComponent],
})
export class SqlQueryComponentModule {}
