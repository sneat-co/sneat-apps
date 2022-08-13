import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactInputModule } from '@sneat/extensions/contactus';
import { ContactWithRefNumComponent } from './contact-with-ref-num.component';

@NgModule({
	imports: [
		CommonModule,
		IonicModule,
		ContactInputModule,
		FormsModule,
	],
	declarations: [
		ContactWithRefNumComponent,
	],
	exports: [
		ContactWithRefNumComponent,
	],
})
export class ContactWithRefNumModule {

}
