import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactSelectorComponent } from '../contact-selector';
import { ContactInputComponent } from './contact-input.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ContactSelectorComponent,
		RouterModule,
		SneatPipesModule,
	],
	declarations: [ContactInputComponent],
	exports: [ContactInputComponent],
})
export class ContactInputModule {}
