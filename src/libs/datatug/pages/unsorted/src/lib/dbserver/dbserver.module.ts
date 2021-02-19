import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {DbserverPageRoutingModule} from './dbserver-routing.module';

import {DbserverPage} from './dbserver.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DbserverPageRoutingModule
	],
	declarations: [DbserverPage]
})
export class DbserverPageModule {
}
