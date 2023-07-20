import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorModule, SelectFromListModule } from '@sneat/components';
import { MakeModelCardComponent } from '../make-model-card/make-model-card.component';
import { VehicleEngineComponent } from '../vehicle-engine/vehicle-engine.component';
import { VehicleCardComponent } from './vehicle-card.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		IonicModule,
		FormsModule,
		SelectFromListModule,
		CountrySelectorModule,
		MakeModelCardComponent,
	],
	declarations: [
		VehicleCardComponent,
		VehicleEngineComponent,
	],
	exports: [VehicleCardComponent],
})
export class VehicleCardComponentModule {

}
