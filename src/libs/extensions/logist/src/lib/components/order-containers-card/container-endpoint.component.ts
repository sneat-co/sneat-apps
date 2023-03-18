import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
	EndpointSide,
	IContainerEndpoint,
	IContainerPoint,
	ILogistOrderContext, IOrderCounterpartyRef,
	ISetContainerEndpointFieldsRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';

function debounce<T>(o: Subject<T>): Observable<T> {
	return o.asObservable().pipe(
		distinctUntilChanged(),
		debounceTime(1000),
	);
}

@Component({
	selector: 'sneat-container-endpoint',
	templateUrl: './container-endpoint.component.html',
})
export class ContainerEndpointComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;
	@Input() containerPoint?: IContainerPoint;
	@Input() shippingPointID?: string;
	@Input() endpointSide?: EndpointSide;

	protected endpoint?: IContainerEndpoint;
	protected byContact?: IContactContext;

	protected unchangedDate?: string;

	private readonly $date = new BehaviorSubject<string | undefined>(undefined);
	private readonly date$ = debounce(this.$date);


	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
	) {
		this.date$.subscribe(this.onDateDebounced);
	}

	private readonly onDateDebounced = (date?: string): void => {
		if (date === this.unchangedDate) {
			return;
		}
		this.setDateField(date);
	};

	get label(): string {
		switch (this.endpointSide) {
			case 'arrival':
				return 'Arrives';
			case 'departure':
				return 'Departs';
			default:
				return this.endpointSide || 'Endpoint Side';
		}
	}

	// protected onByChanged(counterpartyRef: IOrderCounterpartyRef): void {
	// 	const request = this.createSetContainerEndpointFieldsRequest();
	// 	if (!request) {
	// 		return;
	// 	}
	// 	this.orderService.setContainerEndpointFields({
	// 		...request,
	// 		byContactID: counterpartyRef?.contactID || '',
	// 	});
	// }

	protected onByContactChanged(contact?: IContactContext): void {
		const request = this.createSetContainerEndpointFieldsRequest();
		if (!request) {
			return;
		}
		this.orderService.setContainerEndpointFields({
			...request,
			byContactID: contact?.id || '',
		}).subscribe({
			error: this.errorLogger.logErrorHandler(`Failed to set byContactID field for container endpoint ` + this.endpointSide),
		});
	}

	protected onDateChanged(event: Event): void {
		console.log('ContainerEndpointComponent.onDateChanged()', event);
		const ce = event as CustomEvent;
		this.$date.next(ce.detail.value as string);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerPoint'] || changes['endpointSide']) {
			this.endpoint = this.endpointSide ? this.containerPoint?.[this.endpointSide] : undefined;
			console.log('ContainerEndpointComponent.ngOnChanges()', this.endpointSide, changes, this.endpoint);
			this.unchangedDate = this.endpoint?.scheduledDate;
			this.$date.next(this.unchangedDate);
			const byCounterparty = this.order?.dto?.counterparties?.find(c => c.contactID === this.endpoint?.byContactID);
			if (this.team) {
				this.byContact = byCounterparty && {
					id: byCounterparty?.contactID,
					brief: {
						id: byCounterparty.contactID,
						type: 'company',
						title: byCounterparty.title,
						countryID: byCounterparty.countryID,
					},
					team: this.team,
				};
			}
		}
	}

	private createSetContainerEndpointFieldsRequest(): ISetContainerEndpointFieldsRequest | undefined {
		const
			endpointSide = this.endpointSide,
			shippingPointID = this.shippingPointID,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!endpointSide || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			return;
		}
		const request: ISetContainerEndpointFieldsRequest = {
			teamID,
			orderID,
			shippingPointID,
			containerID,
			side: endpointSide,
		};
		return request;
	}

	private setDateField(date?: string): void {
		const request = this.createSetContainerEndpointFieldsRequest();
		if (!request) {
			return;
		}

		this.orderService.setContainerEndpointFields({
			...request,
			dates: { scheduledDate: date },
		}).subscribe({
			next: () => console.log('setContainerEndpointDates() success'),
			error: this.errorLogger.logErrorHandler(`Failed to set container point date field ${name}`),
		});
	}

}
