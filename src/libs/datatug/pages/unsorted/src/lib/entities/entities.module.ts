import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {EntitiesPageRoutingModule} from './entities-routing.module';

import {EntitiesPage} from './entities.page';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EntitiesPageRoutingModule
	],
	declarations: [EntitiesPage]
})
export class EntitiesPageModule {
}
