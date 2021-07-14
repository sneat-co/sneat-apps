import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {QueriesPageRoutingModule} from './queries-routing.module';

import {QueriesPageComponent} from './queries-page.component';
import {DatatugQueriesServicesModule} from '../datatug-queries-services.module';
import {DatatugComponentsSqlEditorModule} from "@sneat/datatug/components/sqleditor";
import {WormholeModule} from "@sneat/wormhole";
import {QueriesTabComponent} from './queries-tab.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DatatugComponentsSqlEditorModule,
		QueriesPageRoutingModule,
		DatatugQueriesServicesModule,
		WormholeModule,
	],
	declarations: [
		QueriesTabComponent,
		QueriesPageComponent,
	]
})
export class QueriesPageModule {
}
