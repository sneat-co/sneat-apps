import { NgIf } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
	IonButton,
	IonCheckbox,
	IonItem,
	IonLabel,
	IonText,
} from '@ionic/angular/standalone';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/contactus-core';
import {
	IAddOrderShippingPointRequest,
	ILogistOrderContext,
	IOrderContainer,
	ShippingPointTask,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { IContainer } from '../order-containers-selector/condainer-interface';
import { OrderContainersSelectorModule } from '../order-containers-selector/order-containers-selector.module';

@Component({
	selector: 'sneat-new-shipping-point-form',
	templateUrl: './new-shipping-point-form.component.html',
	imports: [
		ContactInputComponent,
		IonText,
		IonItem,
		IonCheckbox,
		IonLabel,
		OrderContainersSelectorModule,
		NgIf,
		IonButton,
	],
})
export class NewShippingPointFormComponent {
	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;
	@Output() readonly orderCreated = new EventEmitter<ILogistOrderContext>();
	contact?: IContactContext;

	// containerIDs?: string[];
	protected selectedContainers?: IContainer[];

	protected creating = false;

	load?: boolean;
	unload?: boolean;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
	) {}

	protected onContactChanged(contact?: IContactContext): void {
		this.contact = contact;
	}

	protected onSelectedContainersChanged(
		selectedContainers: IContainer[],
	): void {
		this.selectedContainers = selectedContainers;
	}

	addShippingPoint(): void {
		const order = this.order;
		if (!order?.id) {
			this.errorLogger.logError('No order context');
		}
		if (!order?.space) {
			this.errorLogger.logError('No team context');
			return;
		}
		const contact = this.contact;
		if (!contact?.id) {
			this.errorLogger.logError('Contact is not selected');
			return;
		}
		const tasks: ShippingPointTask[] = [];
		if (this.load) {
			tasks.push('load');
		}
		if (this.unload) {
			tasks.push('unload');
		}
		const containers =
			this.selectedContainers?.map((sc) => ({
				id: sc.id,
				tasks: sc.tasks || [],
			})) || [];
		if (!containers.length) {
			return;
		}
		const request: IAddOrderShippingPointRequest = excludeUndefined({
			tasks: this.selectedContainers?.length ? undefined : tasks,
			spaceID: order.space.id,
			orderID: order.id,
			locationContactID: contact.id,
			containers,
		});
		this.creating = true;
		this.orderService.addShippingPoint(order.space, request).subscribe({
			next: (order) => {
				console.log('Shipping point added');
				this.orderCreated.emit(order);
			},
			error: (e) => {
				this.errorLogger.logError(e, 'Failed to add shipping point');
				this.creating = false;
			},
		});
	}
}
