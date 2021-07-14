import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CellHrefWidgetComponent} from './widgets/cell-href-widget';
import {CellButtonWidgetComponent} from './widgets/cell-button-widget.component';

@NgModule({
	imports: [CommonModule],
	declarations: [
		CellHrefWidgetComponent,
		CellButtonWidgetComponent,
	],
	exports: [
		CellHrefWidgetComponent,
		CellButtonWidgetComponent,
	]
})
export class DatatugPluginsModule {
}
