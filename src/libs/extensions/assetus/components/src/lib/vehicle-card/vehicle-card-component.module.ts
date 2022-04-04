import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VehicleCardComponent } from './vehicle-card.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		IonicModule,
		FormsModule,
	],
	declarations: [VehicleCardComponent],
	exports: [VehicleCardComponent],
})
export class VehicleCardComponentModule {

}
