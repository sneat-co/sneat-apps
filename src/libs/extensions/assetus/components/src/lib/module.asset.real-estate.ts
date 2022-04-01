import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {RealEstateLocationComponent} from './real-estate-location/real-estate-location.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	declarations: [RealEstateLocationComponent],
	exports: [RealEstateLocationComponent],
})
export class ModuleAssetRealEstate {
}
