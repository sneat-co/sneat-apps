import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { FreightOrdersService, IAddSegmentsRequest, IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-new-segment',
	templateUrl: './new-segment.component.html',
})
export class NewSegmentComponent implements OnInit {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;

	byContact?: IContactContext;
	fromContact?: IContactContext;
	toContact?: IContactContext;

	readonly = false;

	from: 'port' | 'dispatcher' = 'port';
	to: 'port' | 'dispatcher' = 'dispatcher';

	containerIDs: string[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly modalController: ModalController,
		private readonly orderService: FreightOrdersService,
	) {
	}

	protected close(): void {
		this.modalController
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('failed to close NewSegmentComponent'));
	}

	onFromChanged(): void {
		if (this.from === 'port' && this.to === 'port') {
			this.to = 'dispatcher';
		}
		this.fromContact = undefined;
	}

	onToChanged(): void {
		if (this.to === 'port' && this.from === 'port') {
			this.from = 'dispatcher';
		}
		this.toContact = undefined;
	}

	isContainerSelected(id: string): boolean {
		return this.containerIDs.includes(id);
	}

	onContainerChecked(event: Event): void {
		console.log('onContainerChecked()', event);
		const ce = event as CustomEvent;
		if (ce.detail.checked) {
			this.containerIDs.push(ce.detail.value);
		} else {
			this.containerIDs = this.containerIDs.filter(id => id !== ce.detail.value);
		}
	}

	onContactChanged(contact: IContactContext): void {
		// this.contact = contact;
	}

	ngOnInit(): void {
		this.containerIDs = this.order?.dto?.containers?.map(c => c.id) || [];
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
		const request: IAddSegmentsRequest = {
			orderID: this.order.id,
			teamID: this.order.team?.id,
			containers: [],
			from: {contactID: this.fromContact.id},
			to: {contactID: this.toContact.id},
			by: this.byContact?.id ? {contactID: this.byContact.id} : undefined,
		};
		this.orderService
			.addSegments(request)
			.subscribe({
				next: (resp) => this.close(),
			});
	}
}
