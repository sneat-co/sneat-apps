import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { excludeEmpty, excludeZeroValues, undefinedIfEmpty } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import { IContainer } from '../order-containers-selector/condainer-interface';
import { SegmentEndpointType } from './segment-counterparty.component';
import {
	ExpressOrderService, IAddSegmentParty,
	IAddSegmentsRequest,
	IExpressOrderContext,
	IOrderContainer,
} from '../..';

@Component({
	selector: 'sneat-new-segment-form',
	templateUrl: './new-segment-form.component.html',
})
export class NewSegmentFormComponent implements OnInit, OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;
	@Input() isInModal?: boolean;

	@Output() readonly created = new EventEmitter<void>();
	@Output() readonly canceled = new EventEmitter<void>();

	byContact?: IContactContext;
	fromContact?: IContactContext = {
		id: '',
		team: { id: '' },
		brief: { id: '', type: 'company', title: '', roles: ['port'] },
	};
	toContact?: IContactContext;

	readonly = false;

	from: 'port' | 'dispatcher' = 'dispatcher';
	to: 'port' | 'dispatcher' = 'port';

	fromDate = '';
	toDate = '';

	fromRefNumber = '';
	toRefNumber = '';
	byRefNumber = '';

	selectedContainers: IContainer[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
	) {
	}

	onSelectedContainersChanged(selectedContainers: IContainer[]): void {
		this.selectedContainers = selectedContainers;
	}

	onByRefNumberChanged(refNumber: string): void {
		this.byRefNumber = refNumber;
	}

	onFromDateChanged(date: string): void {
		if (date && (!this.toDate || this.toDate < date)) {
			this.toDate = date;
		}
	}

	onEndpointTypeChanged(what: 'from' | 'to', endpointType: SegmentEndpointType): void {
		console.log('NewSegmentComponent.onEndpointTypeChanged()', what, endpointType);
		switch (what) {
			case 'from':
				if (this.from === 'port' && this.to === 'port') {
					this.to = 'dispatcher';
				}
				this.fromContact = undefined;
				break;
			case 'to':
				if (this.to === 'port' && this.from === 'port') {
					this.from = 'dispatcher';
				}
				this.toContact = undefined;
				break;
			default:
				throw new Error(`Unknown endpoint type: ${endpointType}`);
		}
	}

	onByContactChanged(contact: IContactContext): void {
		console.log('NewSegmentComponent.onByContactChanged()', contact);
		if (this.byContact && this.byRefNumber) {
			this.byRefNumber = '';
		}
		this.byContact = contact;
	}

	ngOnInit(): void {
		console.log('NewSegmentComponent.ngOnInit()', this.order);
		this.autoFillPort();
	}

	private autoFillPort(): void {
		if (!this.order) {
			return;
		}
		const toPorts = this.order?.dto?.counterparties?.filter(c => c.role === 'port_from');
		if (toPorts?.length == 1) {
			const toPort = toPorts[0];
			this.toContact = {
				id: toPort.contactID,
				team: this.order.team,
				brief: {
					id: toPort.contactID,
					type: 'company',
					countryID: toPort.countryID,
					title: toPort.title,
					roles: ['port'],
				},
			};
		}
		console.log('toContact', this.toContact);
	}

	submitAddSegment(event: Event): void {
		console.log('submitAddSegment', event);
		if (!this.order?.id) {
			alert('order is required');
			return;
		}
		if (!this.order.team) {
			alert('team is required');
			return;
		}
		if (!this.byContact && !confirm('Do you want to add a segment without a carrier?')) {
			return;
		}
		if (!this.fromContact) {
			alert('from contact is required');
			return;
		}
		if (!this.toContact) {
			alert('to contact is required');
			return;
		}
		if (!this.selectedContainers?.length) {
			alert('containers are required to be selected');
			return;
		}
		let by: IAddSegmentParty | undefined = undefined;

		if (this.byContact?.brief) {
			by = {
				counterparty: {
					contactID: this.byContact.id,
					role: 'trucker',
				},
				refNumber: this.byRefNumber,
			};
		}

		const request: IAddSegmentsRequest = excludeEmpty({
			orderID: this.order.id,
			teamID: this.order.team?.id,
			containers: this.selectedContainers.map(c => ({
				id: c.id,
				toLoad: undefinedIfEmpty(excludeZeroValues({
					numberOfPallets: c.pallets,
					grossWeightKg: c.grossKg,
					volumeM3: c.volumeM3,
				})),
			})),
			from: excludeEmpty({
				counterparty: {
					contactID: this.fromContact.id,
					role: this.from === 'port' ? 'port_from' : 'dispatch-point',
				},
				date: this.fromDate,
				refNumber: this.fromRefNumber,
			}),
			to: excludeEmpty({
				counterparty: {
					contactID: this.toContact.id,
					role: this.to === 'port' ? 'port_from' : 'dispatch-point',
				},
				date: this.toDate,
				refNumber: this.toRefNumber,
			}),
			by,
		});
		this.orderService
			.addSegments(request)
			.subscribe({
				next: () => this.created.emit(),
				error: this.errorLogger.logErrorHandler('Failed to add segments'),
			});
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('NewSegmentComponent.ngOnChanges()', changes);
		this.autoFillPort();
	}

	// protected switchFromWithTo(): void {
	// 	const from = this.from, to = this.to;
	// 	const fromContact = this.fromContact, toContact = this.toContact;
	// 	const fromDate = this.fromDate, toDate = this.toDate;
	// 	this.from = to;
	// 	this.to = from;
	// 	setTimeout(() => {
	// 		this.fromContact = toContact;
	// 		this.toContact = fromContact;
	// 		this.fromDate = toDate;
	// 		this.toDate = fromDate;
	// 	}, 10);
	// }

}
