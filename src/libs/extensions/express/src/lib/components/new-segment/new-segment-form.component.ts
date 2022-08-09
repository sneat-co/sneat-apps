import { Component, Inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import { SegmentEndpointType } from './segment-counterparty.component';
import {
	ExpressOrderService,
	IAddSegmentsRequest,
	IExpressOrderContext,
	IOrderContainer,
	IOrderCounterparty,
} from '../..';

@Component({
	selector: 'sneat-new-segment-form',
	templateUrl: './new-segment-form.component.html',
})
export class NewSegmentFormComponent implements OnInit {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;

	byContact?: IContactContext;
	fromContact?: IContactContext = {
		id: 'suxx',
		team: { id: 'suxx_team' },
		brief: { id: 'suxx', type: 'company', title: 'suxx', roles: ['port'] },
	};
	toContact?: IContactContext;

	readonly = false;

	from: 'port' | 'dispatcher' = 'port';
	to: 'port' | 'dispatcher' = 'dispatcher';

	fromDate = '';
	toDate = '';

	selectedContainerIDs: string[] = [];

	private byCounterparty?: IOrderCounterparty;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly modalController: ModalController,
		private readonly orderService: ExpressOrderService,
	) {
	}

	protected close(): void {
		this.modalController
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('failed to close NewSegmentComponent'));
	}

	onFromChanged(endpointType: SegmentEndpointType): void {
		console.log('NewSegmentComponent.onFromChanged()', endpointType, this.from);
		if (this.from === 'port' && this.to === 'port') {
			this.to = 'dispatcher';
		}
		this.fromContact = undefined;
	}

	onToChanged(endpointType: SegmentEndpointType): void {
		console.log('NewSegmentComponent.onToChanged()', endpointType, this.to);
		if (this.to === 'port' && this.from === 'port') {
			this.from = 'dispatcher';
		}
		this.toContact = undefined;
	}


	onByCounterpartyChanged(by: IOrderCounterparty): void {
		console.log('onByCounterpartyChanged', by);
		this.byCounterparty = by;
	}

	onContactChanged(what: 'by' | 'from' | 'to', contact: IContactContext): void {
		console.log('NewSegmentComponent.onContactChanged()', what, contact);
		switch (what) {
			case 'from':
				this.fromContact = contact;
				break;
			case 'to':
				this.toContact = contact;
				break;
			case 'by':
				this.byContact = contact;
		}
	}

	ngOnInit(): void {
		console.log('NewSegmentComponent.ngOnInit()', this.order);
		if (!this.order) {
			return;
		}
		// this.containerIDs = this.order?.dto?.containers?.map(c => c.id) || [];
		const fromPorts = this.order?.dto?.counterparties?.filter(c => c.role === 'port_from');
		if (fromPorts?.length == 1) {
			const fromPort = fromPorts[0];
			this.fromContact = {
				id: fromPort.contactID,
				team: this.order.team,
				brief: {
					id: fromPort.contactID,
					type: 'company',
					countryID: fromPort.countryID,
					title: fromPort.title,
					roles: ['port'],
				},
			};
		}
		console.log('fromContact', this.fromContact);
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
		if (!this.fromContact) {
			alert('from contact is required');
			return;
		}
		if (!this.toContact) {
			alert('to contact is required');
			return;
		}
		if (!this.selectedContainerIDs?.length) {
			alert('containers are required to be selected');
			return;
		}
		let request: IAddSegmentsRequest = {
			orderID: this.order.id,
			teamID: this.order.team?.id,
			containers: this.selectedContainerIDs.map(id => ({ id })),
			from: {
				contactID: this.fromContact.id,
				role: this.from === 'port' ? 'port_from' : 'dispatch-point',
			},
			to: {
				contactID: this.toContact.id,
				role: this.to === 'port' ? 'port_to' : 'dispatch-point',
			},
			by: this.byContact?.id
				? {
					contactID: this.byContact.id,
					role: 'trucker',
				}
				: undefined,
		};
		if (this.fromDate) {
			request = { ...request, departsOn: this.fromDate };
		}
		if (this.toDate) {
			request = { ...request, arrivesOn: this.toDate };
		}
		this.orderService
			.addSegments(request)
			.subscribe({
				next: () => this.close(),
				error: this.errorLogger.logErrorHandler('Failed to add segments'),
			});
	}

	protected switchFromWithTo(): void {
		const from = this.from, to = this.to;
		const fromContact = this.fromContact, toContact = this.toContact;
		const fromDate = this.fromDate, toDate = this.toDate;
		this.from = to;
		this.to = from;
		setTimeout(() => {
			this.fromContact = toContact;
			this.toContact = fromContact;
			this.fromDate = toDate;
			this.toDate = fromDate;
		}, 10);
	}

}
