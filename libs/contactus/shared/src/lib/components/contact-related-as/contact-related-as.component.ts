import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-contact-related-as',
	templateUrl: './contact-related-as.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class ContactRelatedAsComponent {
	@Input({ required: true }) public contact?: IContactContext;
}
