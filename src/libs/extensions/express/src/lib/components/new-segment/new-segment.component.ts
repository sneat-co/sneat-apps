import {  Component, Inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import { ExpressOrderService, IAddSegmentsRequest, IExpressOrderContext, IOrderContainer } from '../..';

interface IContainer extends IOrderContainer {
	checked: boolean;
}


@Component({
	selector: 'sneat-new-segment',
	templateUrl: './new-segment.component.html',
})
export class NewSegmentComponent implements OnInit {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;

	byContact?: IContactContext;
	fromContact?: IContactContext = {id: 'suxx', team: {id: 'suxx_team'}, brief: {id: 'suxx', type: 'company', title: 'suxx', roles: ['port']}};
	toContact?: IContactContext;

	readonly = false;

	from: 'port' | 'dispatcher' = 'port';
	to: 'port' | 'dispatcher' = 'dispatcher';

	fromDate?: string;
	toDate?: string;

	containers?: IContainer[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly modalController: ModalController,
		private readonly orderService: ExpressOrderService,
	) {
	}

	hasUncheckedContainers(): boolean {
		return !!this.containers?.some(c => !c.checked);
	}

	protected close(): void {
		this.modalController
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('failed to close NewSegmentComponent'));
	}

	onFromChanged(event: Event): void {
		console.log('NewSegmentComponent.onFromChanged()', event, this.from);
		const ce = event as CustomEvent;
		if (!ce.detail.value) { // A workaround for what looks like a bug in the ion-segment component
			return;
		}
		if (this.from === 'port' && this.to === 'port') {
			this.to = 'dispatcher';
		}
		this.fromContact = undefined;
	}

	onToChanged(): void {
		console.log('NewSegmentComponent.onToChanged()', this.to);
		if (this.to === 'port' && this.from === 'port') {
			this.from = 'dispatcher';
		}
		this.toContact = undefined;
	}

	onContactChanged(what: 'by'|'from'|'to', contact: IContactContext): void {
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
		this.containers = this.order?.dto?.containers?.map(c => ({...c, checked: false}));
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
		if (!this.containers?.some(c => c.checked)) {
			alert('containers are required to be selected');
			return;
		}
		const request: IAddSegmentsRequest = {
			orderID: this.order.id,
			teamID: this.order.team?.id,
			containers: this.containers.map(c => ({ id: c.id })),
			from: {
				contactID: this.fromContact.id,
				counterpartyRole: this.from === 'port' ? 'port' : 'dispatcher',
			},
			to: {
				contactID: this.toContact.id,
				counterpartyRole: this.to === 'port' ? 'port' : 'dispatcher',
			},
			by: this.byContact?.id
				? {
					contactID: this.byContact.id,
					counterpartyRole: 'tracker',
				}
				: undefined,
		};
		this.orderService
			.addSegments(request)
			.subscribe({
				next: (resp) => this.close(),
				error: this.errorLogger.logErrorHandler('Failed to add segments'),
			});
	}

	protected switchFromWithTo(): void {
		const from = this.from, to = this.to;
		const fromContact = this.fromContact, toContact = this.toContact;
		this.from = to;
		this.to = from;
		setTimeout(() => {
			this.fromContact = toContact;
			this.toContact = fromContact;
		}, 10);
	}

	addAllContainer(): void {
		this.containers = this.containers?.map(c => c.checked ? c : {...c, checked: true});
	}
}
