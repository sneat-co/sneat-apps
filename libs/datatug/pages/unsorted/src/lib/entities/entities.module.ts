import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EntitiesPageRoutingModule } from './entities-routing.module';

import { EntitiesPageComponent } from './entities-page.component';
import { WormholeModule } from '@sneat/wormhole';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EntitiesPageRoutingModule,
		WormholeModule,
	],
	declarations: [EntitiesPageComponent],
})
export class EntitiesPageModule {}
