import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvironmentsPageRoutingModule } from './environments-routing.module';

import { EnvironmentsPageComponent } from './environments-page.component';
import { SneatCardListModule } from '@sneat/components';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EnvironmentsPageRoutingModule,
		SneatCardListModule,
	],
	declarations: [EnvironmentsPageComponent],
})
export class EnvironmentsPageModule {}
