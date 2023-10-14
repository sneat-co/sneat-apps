import { NgModule } from '@angular/core';
import { NewFamilyWizardComponent } from './new-family-wizard.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WizardModule } from '@sneat/wizard';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		WizardModule,
	],
	declarations: [
		NewFamilyWizardComponent,
	],
	exports: [
		NewFamilyWizardComponent,
	],
})
export class NewFamilyWizardModule {

}
