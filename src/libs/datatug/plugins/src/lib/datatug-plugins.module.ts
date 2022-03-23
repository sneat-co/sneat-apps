import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellHrefWidgetComponent } from './widgets/cell-href-widget';
import { CellButtonWidgetComponent } from './widgets/cell-button-widget.component';
import { CellWidgetsComponent } from './widgets';

@NgModule({
	imports: [CommonModule],
	declarations: [
		CellHrefWidgetComponent,
		CellButtonWidgetComponent,
		CellWidgetsComponent,
	],
	exports: [
		CellHrefWidgetComponent,
		CellButtonWidgetComponent,
		CellWidgetsComponent,
	],
})
export class DatatugPluginsModule {
}
