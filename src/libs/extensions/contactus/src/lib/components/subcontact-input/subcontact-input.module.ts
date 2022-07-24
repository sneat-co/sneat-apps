import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SubcontactInputComponent } from './subcontact-input.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
	],
	declarations: [
		SubcontactInputComponent,
	],
	exports: [
		SubcontactInputComponent
	],
})
export class SubcontactInputModule {

}
