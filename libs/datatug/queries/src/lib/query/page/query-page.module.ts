import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { QueryPageComponent } from './query-page.component';
import { SqlQueryComponentModule } from '../sql-query/sql-query.component.module';
import { HttpQueryEditorModule } from '../http-query/http-query-editor.module';
import { QueryPageRoutingModule } from './query-page-routing.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SqlQueryComponentModule,
		HttpQueryEditorModule,
		QueryPageRoutingModule,
	],
	declarations: [QueryPageComponent],
})
export class QueryPageModule {
	constructor() {
		console.log('QueryPageModule.constructor');
	}
}
