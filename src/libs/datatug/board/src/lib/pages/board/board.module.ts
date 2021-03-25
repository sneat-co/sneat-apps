import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {BoardPageRoutingModule} from './board-routing.module';

import {BoardPageComponent} from './board-page.component';
import {QueryParamsService} from '@sneat/datatug/core';
import {DatatugBoardModule} from '../../datatug-board.module';
import {BoardServiceModule} from "../../board.service.module";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		BoardServiceModule,
		BoardPageRoutingModule,
		DatatugBoardModule,
	],
	declarations: [
		BoardPageComponent,
	],
	providers: [
		QueryParamsService,
	]
})
export class BoardPageModule {
}
