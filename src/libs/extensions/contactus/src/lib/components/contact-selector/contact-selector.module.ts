import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SelectFromListModule } from '@sneat/components';
import { LocationFormModule } from '../location-form';
import { ContactSelectorComponent } from './contact-selector.component';
import { ContactSelectorService } from './contact-selector.service';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SelectFromListModule,
    LocationFormModule,
  ],
	declarations: [
		ContactSelectorComponent,
	],
	exports: [
		ContactSelectorComponent,
	],
	providers: [
		ContactSelectorService,
	],
})
export class ContactSelectorModule {

}
