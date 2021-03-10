import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlQueriesPageRoutingModule} from './queries-routing.module';

import {QueriesPageComponent} from './queries-page.component';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';
import {DatatugComponentsSqlEditorModule} from "@sneat/datatug/components/sqleditor";
import {QueriesMenuComponent} from "../queries-menu.component";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsSqlEditorModule,
		SqlQueriesPageRoutingModule,
		QueriesServiceModule,
		DatatugBoardModule,
	],
	declarations: [
		QueriesPageComponent,
		QueriesMenuComponent,
	]
})
export class QueriesPageModule {
}
