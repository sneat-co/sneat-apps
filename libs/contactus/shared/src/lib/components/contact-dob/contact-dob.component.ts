import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IIdAndBriefAndOptionalDto } from '@sneat/core';
import { IContactBrief, IContactDto } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-dob',
	templateUrl: './contact-dob.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class ContactDobComponent {
	@Input({ required: true }) public contact?: IIdAndBriefAndOptionalDto<
		IContactBrief,
		IContactDto
	>;
}
