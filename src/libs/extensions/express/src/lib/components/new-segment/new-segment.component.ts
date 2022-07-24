import { Component, Input } from '@angular/core';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../..';

@Component({
	selector: 'sneat-new-segment',
	templateUrl: './new-segment.component.html',
})
export class NewSegmentComponent {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	contact?: IContactContext;
	readonly = false;

	onContactChanged(contact: IContactContext): void {
		this.contact = contact;
	}
}
