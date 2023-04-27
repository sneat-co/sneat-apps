import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MultiSelectorModule } from '../selector/multi-selector';
import { ContactRolesInputComponent } from './contact-roles-input.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		MultiSelectorModule,
	],
	declarations: [
		ContactRolesInputComponent,
	],
	exports: [
		ContactRolesInputComponent,
	],
})
export class ContactRolesInputModule {

}
