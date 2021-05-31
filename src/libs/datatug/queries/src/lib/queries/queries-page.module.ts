import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {QueriesPageRoutingModule} from './queries-routing.module';

import {QueriesPageComponent} from './queries-page.component';
import {QueriesServiceModule} from '@sneat/datatug/services/unsorted';
import {DatatugComponentsSqlEditorModule} from "@sneat/datatug/components/sqleditor";
import {WormholeModule} from "@sneat/wormhole";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsSqlEditorModule,
		QueriesPageRoutingModule,
		QueriesServiceModule,
		WormholeModule,
	],
	declarations: [
		QueriesPageComponent,
	]
})
export class QueriesPageModule {
}
