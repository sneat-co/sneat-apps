import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectFromListModule } from '../select-from-list/select-from-list.module';
import { CountrySelectorComponent } from './country-selector.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectFromListModule,
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
