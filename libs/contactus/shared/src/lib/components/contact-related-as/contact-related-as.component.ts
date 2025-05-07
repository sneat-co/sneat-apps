import { Component, Input } from '@angular/core';
import { IContactContext } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-contact-related-as',
	templateUrl: './contact-related-as.component.html',
	imports: [],
})
export class ContactRelatedAsComponent {
	@Input({ required: true }) public contact?: IContactContext;
}
