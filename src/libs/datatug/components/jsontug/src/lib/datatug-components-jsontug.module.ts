import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {JsonTableComponent} from './json-table.component';
import {JsonGridComponent} from './json-grid.component';

@NgModule({
	imports: [CommonModule],
	declarations: [
		JsonTableComponent,
		JsonGridComponent,
	],
	exports: [
		JsonTableComponent,
	]
})
export class DatatugComponentsJsontugModule {
}
