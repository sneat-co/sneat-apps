import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {SqlQueriesPageRoutingModule} from './queries-routing.module';

import {QueriesPageComponent} from './queries-page.component';
import {DatatugBoardModule} from '@sneat/datatug/board';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';
import {DatatugComponentsSqlEditorModule} from "@sneat/datatug/components/sqleditor";
import {DatatugComponentsProjectModule} from "@sneat/datatug/components/project";
import {WormholeModule} from "@sneat/wormhole";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsSqlEditorModule,
		SqlQueriesPageRoutingModule,
		QueriesServiceModule,
		DatatugBoardModule,
		DatatugComponentsProjectModule,
		WormholeModule,
	],
	declarations: [
		QueriesPageComponent,
	]
})
export class QueriesPageModule {
}
