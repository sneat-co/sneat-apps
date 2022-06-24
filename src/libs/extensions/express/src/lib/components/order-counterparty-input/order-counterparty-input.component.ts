import { Component, Inject, Input } from '@angular/core';
import { ContactRoleExpress } from '@sneat/dto';
import { FreightOrdersService } from '../../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, ISetOrderCounterpartyRequest } from '../../dto';

@Component({
	selector: 'sneat-express-order-counterparty-input',
	templateUrl: './order-counterparty-input.component.html',
})
export class OrderCounterpartyInputComponent {
	@Input() readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() counterpartyRole: ContactRoleExpress | '' = '';

	readonly label = () => this.counterpartyRole[0].toUpperCase() + this.counterpartyRole.slice(1);

	get contact(): IContactContext | undefined {
		const c = this.order?.dto?.counterparties?.find(c => c.role === this.counterpartyRole);
		if (c) {
			const contact: IContactContext = {
				id: c.contactID,
				brief: {
					// type: 'person',
					id: c.contactID,
					title: c.title,
					name: {full: c.title},
				},
			}
			return contact;
		}
		return undefined;
	};

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: FreightOrdersService,
	) {

	}

	protected onContactChanged(contact: IContactContext): void {
		console.log('onContactChanged(), contact:', contact);
		if (!this.team) {
			console.error('onContactChanged(): !this.team');
			return;
		}
		if (!this.counterpartyRole) {
			console.error('onContactChanged(): !this.counterpartyRole');
			return;
		}
		if (!this.order?.id) {
			console.error('onContactChanged(): !this.order?.id', this.order);
			return;
		}
		const request: ISetOrderCounterpartyRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			contactID: contact.id.substring(contact.id.indexOf(':') + 1),
			role: this.counterpartyRole,
		};
		this.orderService.setOrderCounterparty(request).subscribe({
			next: counterparty => {
				if (!this.order?.brief) {
					return;
				}
				switch (this.counterpartyRole) {
					case 'buyer':
						this.order.brief.buyer = counterparty;
						break;
					case 'shipper':
						this.order.brief.shipper = counterparty;
						break;
					case 'agent':
						this.order.brief.agent = counterparty;
						break;
					case 'consignee':
						this.order.brief.consignee = counterparty;
						break;
					case 'carrier':
						this.order.brief.carrier = counterparty;
						break;
				}
			},
			error: this.errorLogger.logErrorHandler(`Failed to set order's counterparty`),
		});
	}
}
