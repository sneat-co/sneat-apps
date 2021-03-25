import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QueriesMenuComponent} from "./queries-menu.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {QueryEditorStateService} from "./query-editor-state-service";

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
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
