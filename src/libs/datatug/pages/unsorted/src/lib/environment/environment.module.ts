import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvironmentPageRoutingModule } from './environment-routing.module';

import { EnvironmentPageComponent } from './environment-page.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		EnvironmentPageRoutingModule,
	],
	declarations: [EnvironmentPageComponent],
})
export class EnvironmentPageModule {
}
