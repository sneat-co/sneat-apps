import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import { IAddOrderShippingPointRequest, ILogistOrderContext, IOrderContainer } from '../../dto';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-new-shipping-point-form',
	templateUrl: './new-shipping-point-form.component.html',
})
export class NewShippingPointFormComponent {

	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;
	@Output() readonly orderCreated = new EventEmitter<ILogistOrderContext>();
	contact?: IContactContext;

	containerIDs?: string[];

	protected creating = false;

	load?: boolean;
	unload?: boolean;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
	) {
	}

	protected onContactChanged(contact: IContactContext): void {
		this.contact = contact;
	}

	protected onSelectedContainerIDsChanged(containerIDs: string[]): void {
		this.containerIDs = containerIDs;
	}

	addShippingPoint(): void {
		const order = this.order;
		if (!order?.id) {
			this.errorLogger.logError('No order context');
		}
		if (!order?.team) {
			this.errorLogger.logError('No team context');
			return;
		}
		const contact = this.contact;
		if (!contact?.id) {
			this.errorLogger.logError('Contact is not selected');
			return;
		}
		this.creating = true;
		const tasks: ('load' | 'unload')[] = [];
		if (this.load) {
			tasks.push('load');
		}
		if (this.unload) {
			tasks.push('unload');
		}
		const request: IAddOrderShippingPointRequest = {
			teamID: order.team.id,
			orderID: order.id,
			containerIDs: this.containerIDs,
			locationContactID: contact.id,
			tasks,
		};
		this.orderService.addShippingPoint(order.team, request)
			.subscribe({
				next: (order) => {
					console.log('Shipping point added');
					this.orderCreated.emit(order);
				},
				error: e => {
					this.errorLogger.logError(e, 'Failed to add shipping point');
					this.creating = false;
				},
			});
	}
}
