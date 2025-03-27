import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import {
	ContactRole,
	ContactType,
	LogistOrderContactRole,
} from '@sneat/contactus-core';
import {
	ContactSelectorService,
	IContactSelectorOptions,
} from '@sneat/contactus-shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	CounterpartyRole,
	IAddOrderShippingPointRequest,
	IDeleteCounterpartyRequest,
	ILogistOrderContext,
	IOrderCounterparty,
	IOrderCounterpartyRef,
} from '../../dto';
import { LogistOrderService } from '../../services';

interface ICounterparty extends IOrderCounterparty {
	parentCounterparty?: IOrderCounterparty;
}

@Component({
	selector: 'sneat-logist-order-counterparties',
	templateUrl: './order-counterparties.component.html',
	standalone: false,
})
export class OrderCounterpartiesComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
	@Output() readonly orderChange = new EventEmitter<ILogistOrderContext>();
	@Input() readonly = false;
	@Input() emoji?: string;
	@Input() plural = 'plural TO BE SET';
	@Input() singular = 'singular TO BE SET';
	@Input() parentRole?: 'dispatcher' | 'what else?' = 'dispatcher';
	@Input() contactRole: LogistOrderContactRole = 'location';
	@Input() counterpartyRole: CounterpartyRole = 'dispatch_point';
	@Input() contactType?: ContactType;

	readonly deleting: IOrderCounterpartyRef[] = [];

	public counterparties?: ICounterparty[];

	protected readonly index = (i: number) => i;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: LogistOrderService,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.setCounterparties();
		}
	}

	private setCounterparties(): void {
		const counterparties = this.order?.dbo?.counterparties || [];

		this.counterparties = counterparties
			.filter((c) => c.role === this.contactRole)
			.map((c) =>
				c.parent
					? {
							...c,
							parent: counterparties.find(
								(cc) => cc.contactID === c.parent?.contactID,
							),
						}
					: c,
			);
	}

	addCounterparty(event: Event): void {
		console.log('addCounterparty(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		const space = this.space;
		if (!space) {
			this.errorLogger.logError(
				'ContactInputComponent.openContactSelector(): team is required',
				undefined,
			);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			componentProps: {
				space: space,
				contactRole: this.contactRole as ContactRole,
				parentRole: this.parentRole as ContactRole,
				contactType: this.contactType,
				excludeContacts: this.counterparties?.map((c) => ({
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
					return;
				}
				if (!contact?.brief) {
					return;
				}
				if (!this.order?.dbo) {
					return;
				}
				const counterparty: IOrderCounterparty = {
					contactID: contact.id,
					title: contact.brief.title || contact.id,
					role: this.counterpartyRole,
					address: contact.brief.address,
					countryID: contact.brief.address?.countryID || '--',
				};
				this.order = {
					...this.order,
					dbo: {
						...this.order.dbo,
						counterparties: [
							...(this.order.dbo.counterparties || []),
							counterparty,
						],
					},
				};
				const request: IAddOrderShippingPointRequest = {
					spaceID: space.id,
					orderID: this.order.id,
					tasks: ['load'],
					locationContactID: contact.id,
				};
				this.ordersService.addShippingPoint(space, request).subscribe({
					next: () => {
						console.log('added shipping point added to order');
					},
					error: (e) => {
						this.errorLogger.logError(
							e,
							'Failed to add shipping point to order',
						);
					},
				});
				this.setCounterparties();
				this.emitOrder();
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to open contact selector'),
			);
	}

	private emitOrder(): void {
		this.orderChange.emit(this.order);
	}

	remove(counterparty: ICounterparty): void {
		if (!this.space?.id) {
			throw new Error('space is required');
		}
		if (!this.order?.id) {
			throw new Error('space is required');
		}
		const request: IDeleteCounterpartyRequest = {
			spaceID: this.space.id,
			orderID: this.order.id,
			role: counterparty.role,
			contactID: counterparty.contactID,
		};
		this.deleting.push(counterparty);
		this.ordersService.deleteCounterparty(request).subscribe({
			next: () => {
				console.log('deleted counterparty');
			},
			error: this.errorLogger.logErrorHandler('failed to delete counterparty'),
		});
	}
}
