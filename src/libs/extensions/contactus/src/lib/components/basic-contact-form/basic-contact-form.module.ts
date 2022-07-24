import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BasicContactFormComponent } from './basic-contact-form.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
	],
	declarations: [
		BasicContactFormComponent,
	],
	exports: [
		BasicContactFormComponent,
	],
})
export class BasicContactFormModule {
}
