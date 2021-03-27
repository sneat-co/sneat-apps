import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QueriesMenuComponent} from "./queries-menu.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {QueryEditorStateService} from "./query-editor-state-service";
import {QueriesServiceModule} from "./queries.service.module";

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		QueriesServiceModule,
	],
	declarations: [
		QueriesMenuComponent,
	],
	exports: [
		QueriesMenuComponent,
	],
	providers: [
		QueryEditorStateService,
	]
})
export class DatatugQueriesModule {
}
