import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QueriesMenuComponent} from "./queries-menu.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {DatatugQueriesServicesModule} from "./datatug-queries-services.module";
import {DatatugQueriesUiModule} from './datatug-queries-ui.module';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		DatatugQueriesServicesModule,
		DatatugQueriesUiModule,
	],
	declarations: [
		QueriesMenuComponent,
	],
	exports: [
		QueriesMenuComponent,
	],
})
export class DatatugQueriesMenuModule {
}
