import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
	EndpointDateField,
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

	protected readonly scheduledDate = new FormControl<string>('');
	protected readonly actualDate = new FormControl<string>('');

	protected readonly datesForm = new FormGroup({
		scheduledDate: this.scheduledDate,
		actualDate: this.actualDate,
	});

	protected label = 'Endpoint Side';

	private readonly $scheduledDate = new BehaviorSubject<string>('');
	private readonly scheduledDate$ = debounce(this.$scheduledDate);

	private readonly $actualDate = new BehaviorSubject<string>('');
	private readonly actualDate$ = debounce(this.$actualDate);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changedDetectorRef: ChangeDetectorRef,
	) {
		this.scheduledDate$.subscribe(date => this.onDateDebounced('scheduledDate', date));
		this.actualDate$.subscribe(date => this.onDateDebounced('actualDate', date));
	}

	private readonly onDateDebounced = (field: EndpointDateField, date: string): void => {
		if (date === this.endpoint?.[field]) {
			return;
		}
		this.setDateField(field, date || '');
	};

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

	protected onDateChanged(field: EndpointDateField, event: Event): void {
		console.log('ContainerEndpointComponent.onDateChanged()', this.endpointSide, field, event);
		switch (field) {
			case 'scheduledDate':
				this.$scheduledDate.next(this.scheduledDate.value || '');
				break;
			case 'actualDate':
				this.$actualDate.next(this.actualDate.value || '');
				break;
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerPoint'] || changes['endpointSide']) {
			switch (this.endpointSide) {
				case 'arrival':
					this.label = 'Arrives';
					break;
				case 'departure':
					this.label = 'Departs';
					break;
				default:
					this.label = 'Endpoint Side';
					break;
			}
			this.endpoint = this.endpointSide ? this.containerPoint?.[this.endpointSide] : undefined;
			console.log('ContainerEndpointComponent.ngOnChanges()', this.endpointSide, changes, this.endpoint);
			this.scheduledDate.setValue(this.endpoint?.scheduledDate || '');
			this.actualDate.setValue(this.endpoint?.actualDate || '');
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

	private setDateField(field: EndpointDateField, date: string): void {
		if (date === (this.endpoint?.scheduledDate || '')) {
			return;
		}
		console.log('setDateField()', field, date);
		const request = this.createSetContainerEndpointFieldsRequest();
		if (!request) {
			return;
		}
		this.orderService.setContainerEndpointFields({
			...request,
			dates: { [field]: date },
		}).subscribe({
			next: () => {
				console.log('setContainerEndpointDates() success');
			},
			error: err => {
				this.errorLogger.logError(err, `Failed to set container point ${field} date to ${date}`);
				this.scheduledDate.reset();
				this.changedDetectorRef.detectChanges();
			},
		});
	}

}
