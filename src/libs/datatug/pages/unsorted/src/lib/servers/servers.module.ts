import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ServersPageRoutingModule} from './servers-routing.module';

import {ServersPage} from './servers.page';
import {DatatugDbModalsAddDbServerModule} from '@sneat/datatug/db';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ServersPageRoutingModule,
    DatatugDbModalsAddDbServerModule,
	],
	declarations: [ServersPage]
})
export class ServersPageModule {
}
