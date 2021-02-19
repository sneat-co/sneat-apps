import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {BoardPageRoutingModule} from './board-routing.module';

import {BoardPage} from './board.page';
import {QueryParamsService} from '@sneat/datatug/core';
import {DatatugBoardModule} from '../../datatug-board.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		BoardPageRoutingModule,
		DatatugBoardModule,
	],
	declarations: [
		BoardPage,
	],
	providers: [
		QueryParamsService,
	]
})
export class BoardPageModule {
}
