import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactRoleFormComponent } from './contact-role-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [
		ContactRoleFormComponent,
	],
	exports: [
		ContactRoleFormComponent,
	]
})
export class ContactRoleFormModule {

}
