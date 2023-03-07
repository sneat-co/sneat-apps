import { Component, Input } from '@angular/core';
import { IContactContext } from '@sneat/team/models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-new-shipping-point-form',
	templateUrl: './new-shipping-point-form.component.html',
})
export class NewShippingPointFormComponent {

	@Input() order?: ILogistOrderContext;
	contact?: IContactContext;

	protected onContactChanged(contact: IContactContext): void {
		this.contact = contact;
	}
}
