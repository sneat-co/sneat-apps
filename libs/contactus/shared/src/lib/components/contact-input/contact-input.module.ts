import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactSelectorServiceModule } from '../contact-selector/contact-selector.module';
import { ContactInputComponent } from './contact-input.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		RouterModule,
		SneatPipesModule,
		ContactSelectorServiceModule,
	],
	declarations: [ContactInputComponent],
	exports: [ContactInputComponent],
})
export class ContactInputModule {}
