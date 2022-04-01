import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountrySelectorComponent } from './country-selector.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
	],
	entryComponents: [
		CountrySelectorComponent,
	],
	declarations: [
		CountrySelectorComponent,
	],
	exports: [
		CountrySelectorComponent,
	],
})
export class CountrySelectorModule {
}
