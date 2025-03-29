import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import { IContactBrief, IContactDbo } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-dob',
	templateUrl: './contact-dob.component.html',
	imports: [CommonModule, IonicModule],
})
export class ContactDobComponent {
	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDbo<
		IContactBrief,
		IContactDbo
	>;
}
