import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { excludeUndefined } from '@sneat/core';
import {
	ContactSelectorService,
	IContactSelectorOptions,
} from '@sneat/contactus-shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAddOrderShippingPointRequest,
	IDeleteCounterpartyRequest,
	ILogistOrderContext,
	IOrderCounterparty,
	ISetOrderCounterpartiesRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-order-dispatcher',
	templateUrl: './dispatcher.component.html',
	standalone: false,
})
export class DispatcherComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Input() counterparty?: IOrderCounterparty;
	@Input() orderDispatchers?: readonly IOrderCounterparty[];

	@Output() orderChange = new EventEmitter<ILogistOrderContext>();

	locations?: IOrderCounterparty[];

	deleting = false;

	refNumber = new FormControl<string>('');
	// specialInstructions = new FormControl<string>('');

	form = new FormGroup({
		refNumber: this.refNumber,
		// specInstructions: this.specialInstructions,
	});

	saving = false;

	protected readonly counterpartyKey = (i: number, c: IOrderCounterparty) =>
		`${c.contactID}&${c.role}`;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: LogistOrderService,
	) {}

	cancelChanges(): void {
		this.form.reset();
		this.setOrder(true);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['counterparty']) {
			this.setOrder(!!changes['counterparty']);
		}
	}

	private setOrder(counterpartyChanged: boolean): void {
		const contactID = this.counterparty?.contactID;
		this.locations = this.order?.dbo?.counterparties?.filter(
			(l) => l.parent?.contactID === contactID,
		);
		if (counterpartyChanged && !this.refNumber.dirty) {
			this.refNumber.setValue(this.counterparty?.refNumber || '');
			// this.specialInstructions.setValue(this.counterparty?.specialInstructions || '');
		}
	}

	addShippingPoint(event: Event): void {
		console.log('addDispatchPoint(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		const space = this.order?.space;
		if (!space) {
			this.errorLogger.logError(
				'ContactInputComponent.openContactSelector(): team is required',
				undefined,
			);
			return;
		}
		const dispatcher = this.counterparty;
		if (!dispatcher) {
			alert('dispatcher is required');
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				space: space,
				contactRole: 'dispatch_point',
				contactType: 'location',
				parentRole: 'dispatcher',
				parentContact: {
					id: dispatcher.contactID,
					space,
					brief: {
						type: 'company',
						title: dispatcher.title,
						countryID: dispatcher.countryID,
					},
				},
				excludeContacts: this.orderDispatchers?.map((c) => ({
					id: c.contactID,
					space,
				})),
			},
		};
		this.contactSelectorService
			.selectSingleInModal(selectorOptions)
			.then((contact) => {
				console.log(
					'OrderCounterpartiesCardComponent.openContactSelector() contact:',
					contact,
				);
				if (!this.order?.dbo) {
					alert('Order is not loaded');
					return;
				}
				if (!contact?.brief) {
					alert('Contact is not loaded');
					return;
				}
				const space = this.order.space;
				// const counterparty: IOrderCounterparty = {
				// 	contactID: contact.id,
				// 	title: contact.brief.title || contact.id,
				// 	role: 'dispatcher',
				// 	address: contact.brief.address,
				// 	countryID: contact.brief.address?.countryID || '--',
				// };
				const request: IAddOrderShippingPointRequest = {
					spaceID: space.id,
					orderID: this.order.id,
					tasks: ['load'],
					locationContactID: contact.id,
				};
				this.ordersService.addShippingPoint(space, request).subscribe({
					next: (order) => {
						console.log('added shipping point added to order');
						this.order = { ...order, space: this.order?.space || space };
						this.orderChange.emit(this.order);
					},
					error: (e) => {
						this.errorLogger.logError(
							e,
							'Failed to add shipping point to order',
						);
					},
				});
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to open contact selector'),
			);
	}

	saveChanges(): void {
		if (
			!this.order ||
			!this.counterparty?.contactID ||
			!this.counterparty?.role
		) {
			return;
		}
		const request: ISetOrderCounterpartiesRequest = {
			spaceID: this.order.space.id,
			orderID: this.order.id,
			counterparties: [
				excludeUndefined({
					contactID: this.counterparty.contactID,
					role: this.counterparty.role,
					refNumber: this.refNumber.value || undefined,
					// specialInstructions: this.specialInstructions.value || undefined,
				}),
			],
		};
		this.saving = true;
		this.form.disable();
		this.ordersService.setOrderCounterparties(request).subscribe({
			next: () => {
				this.form.markAsPristine();
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to save dispatcher');
			},
			complete: () => {
				this.saving = false;
				this.form.disable();
			},
		});
	}

	deleteDispatcher(): void {
		if (!this.order || !this.counterparty) {
			return;
		}
		const request: IDeleteCounterpartyRequest = {
			spaceID: this.order?.space?.id,
			orderID: this.order.id,
			contactID: this.counterparty?.contactID,
			role: 'dispatcher',
		};
		this.deleting = true;
		this.ordersService.deleteCounterparty(request).subscribe({
			next: () => {
				console.log('deleted dispatcher');
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete dispatcher');
				this.deleting = false;
			},
		});
	}
}
