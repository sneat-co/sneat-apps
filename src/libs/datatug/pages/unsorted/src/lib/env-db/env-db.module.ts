import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EnvDbPageRoutingModule} from './env-db-routing.module';

import {EnvDbPage} from './env-db.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EnvDbPageRoutingModule,
	],
	declarations: [EnvDbPage]
})
export class EnvDbPageModule {
}
