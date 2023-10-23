import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { DatatugComponentsDatagridModule } from '@sneat/datatug/components/datagrid';
import { DatatugComponentsSqlEditorModule } from '@sneat/datatug/components/sqleditor';
import { DatatugComponentsParametersModule } from '@sneat/datatug/components/parameters';
import { BoardComponent } from './components/board/board.component';
import { EnvSelectorComponent } from './components/env-selector/env-selector.component';
import { GridWidgetComponent } from './components/widgets/grid-widget/grid-widget.component';
import { SqlQueryWidgetComponent } from './components/widgets/sql-query-widget/sql-query-widget.component';
import { BoardWidgetComponent } from './components/board-widget/board-widget.component';
import { BoardCardComponent } from './components/board-card/board-card.component';
import { TabsWidgetComponent } from './components/widgets/tabs-widget/tabs-widget.component';
import { NewCardDialogComponent } from './modals/new-card-dialog/new-card-dialog.component';
import { BoardRowComponent } from './components/board-row/board-row.component';

@NgModule({
	imports: [
		IonicModule,
		FormsModule,
		CommonModule,
		RouterModule,
		// TableMetaCardModule,
		CodemirrorModule,
		DatatugComponentsDatagridModule,
		DatatugComponentsSqlEditorModule,
		DatatugComponentsParametersModule,
	],
	declarations: [
		TabsWidgetComponent,
		BoardCardComponent,
		BoardRowComponent,
		BoardComponent,
		TabsWidgetComponent,
		SqlQueryWidgetComponent,
		GridWidgetComponent,
		BoardWidgetComponent,
		EnvSelectorComponent,
		NewCardDialogComponent, // TODO: move to a dedicated module with pre-loading to speedup page cold start time
	],
	exports: [BoardComponent, EnvSelectorComponent, GridWidgetComponent],
})
export class DatatugBoardUiModule {}
