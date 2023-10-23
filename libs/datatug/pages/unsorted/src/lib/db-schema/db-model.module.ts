import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DbModelPageRoutingModule } from './db-model-routing.module';

import { DbModelPageComponent } from './db-model-page.component';
import { SneatCardListModule } from '@sneat/components';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		DbModelPageRoutingModule,
		SneatCardListModule,
	],
	declarations: [DbModelPageComponent],
})
export class DbModelPageModule {}
