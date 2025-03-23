import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { ContactWithRefNumComponent } from './contact-with-ref-num.component';

@NgModule({
	imports: [CommonModule, IonicModule, ContactInputComponent, FormsModule],
	declarations: [ContactWithRefNumComponent],
	exports: [ContactWithRefNumComponent],
})
export class ContactWithRefNumModule {}
