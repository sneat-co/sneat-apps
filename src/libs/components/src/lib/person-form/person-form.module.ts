import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PersonFormComponent } from './person-form.component';
import { EmailsFormComponent } from './emails-form/emails-form.component';
import { NamesFormComponent } from './names-form/names-form.component';
import { PhonesFormComponent } from './phones-form/phones-form.component';
import { GenderFormComponent } from './gender-form/gender-form.component';

@NgModule({
	imports: [CommonModule, IonicModule, FormsModule, ReactiveFormsModule],
	declarations: [
		PersonFormComponent,
		EmailsFormComponent,
		NamesFormComponent,
		PhonesFormComponent,
		GenderFormComponent,
	],
	exports: [PersonFormComponent, NamesFormComponent, GenderFormComponent],
})
export class PersonFormModule {}
