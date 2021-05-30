import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {QueryPageComponent} from './query-page.component';
import {SqlQueryComponentModule} from "./sql-query/sql-query.component.module";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SqlQueryComponentModule,
	],
	declarations: [
		QueryPageComponent,
	],
})
export class QueryPageModule {
}
