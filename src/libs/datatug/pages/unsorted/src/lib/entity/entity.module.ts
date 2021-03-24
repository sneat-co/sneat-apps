import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EntityPageRoutingModule} from './entity-routing.module';

import {EntityPageComponent} from './entity-page.component';
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
	declarations: [EntityPageComponent]
})
export class EntityPageModule {
}
