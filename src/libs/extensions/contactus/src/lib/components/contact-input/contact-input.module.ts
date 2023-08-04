import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ContactServiceModule } from '../../../../../../team/contacts/services/src/lib';
import { ContactSelectorModule } from '../contact-selector/contact-selector.module';
import { ContactInputComponent } from './contact-input.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ContactServiceModule,
    ContactSelectorModule,
    RouterModule,
    SneatPipesModule,
  ],
	declarations: [
		ContactInputComponent,
	],
	exports: [
		ContactInputComponent,
	],
})
export class ContactInputModule {
}
