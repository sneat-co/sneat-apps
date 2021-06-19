import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EnvDbTablePageRoutingModule} from './env-db-table-routing.module';

import {EnvDbTablePageComponent} from './env-db-table.page';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {ForeignKeyCardComponent} from './foreign-key-card/foreign-key-card.component';
import {RecordTabComponent} from './record-tab/record-tab.component';
import {RecordValuesCardComponent} from './record-values-card/record-values-card.component';
import {RefByCardComponent} from './ref-by-card/ref-by-card.component';
import {TableMetaCardModule} from '@sneat/datatug/components/dbmeta';
import {DatatugComponentsDatagridModule} from '@sneat/datatug/components/datagrid';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EnvDbTablePageRoutingModule,
		TableMetaCardModule,
    DatatugComponentsDatagridModule,
		CodemirrorModule,
	],
	declarations: [
		EnvDbTablePageComponent,
		ForeignKeyCardComponent,
		RecordTabComponent,
		RecordValuesCardComponent,
		RefByCardComponent,
	],
})
export class EnvDbTablePageModule {
}
