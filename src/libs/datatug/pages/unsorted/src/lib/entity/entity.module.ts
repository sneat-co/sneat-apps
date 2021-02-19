import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EntityPageRoutingModule} from './entity-routing.module';

import {EntityPage} from './entity.page';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';
import {DatatugBoardModule} from '@sneat/datatug/board';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EntityPageRoutingModule,
		DatatugBoardModule,
		DatatugComponentsDatagridModule,
	],
	declarations: [EntityPage]
})
export class EntityPageModule {
}
