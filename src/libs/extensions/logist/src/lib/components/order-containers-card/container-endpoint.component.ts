import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import {
	EndpointDateField,
	EndpointSide, EndpointTimeField,
	IContainerEndpoint,
	IContainerPoint,
	ILogistOrderContext,
	ISetContainerEndpointFieldsRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';

function debounce<T>(field: string, o: Subject<T>): Observable<T> {
	return o.asObservable().pipe(
		distinctUntilChanged(),
		tap(value => console.log(`ContainerEndpointComponent.distinct: ${field}=${value}`)),
		debounceTime(1000),
		tap(value => console.log(`ContainerEndpointComponent.debounced: ${field}=${value}`)),
	);
}

@Component({
	selector: 'sneat-container-endpoint',
	templateUrl: './container-endpoint.component.html',
})
export class ContainerEndpointComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input() order?: ILogistOrderContext;
	@Input() containerPoint?: IContainerPoint;
	@Input() shippingPointID?: string;
	@Input() endpointSide?: EndpointSide;
	@Input() dateTimeTab: 'scheduled' | 'actual' = 'scheduled';

	protected endpoint?: IContainerEndpoint;
	protected byContact?: IContactContext;

	protected readonly scheduledDate = new FormControl<string>('');
	protected readonly scheduledTime = new FormControl<string>('');
	protected readonly actualDate = new FormControl<string>('');
	protected readonly actualTime = new FormControl<string>('');

	protected labelScheduled = 'Scheduled';
	protected labelActual = 'Actual';

	private readonly $scheduledDate = new Subject<string>();
	private readonly scheduledDate$ = debounce('scheduledDate', this.$scheduledDate);

	private readonly $scheduledTime = new Subject<string>();
	private readonly scheduledTime$ = debounce('scheduledTime', this.$scheduledTime);

	private readonly $actualDate = new Subject<string>();
	private readonly actualDate$ = debounce('actualTime', this.$actualDate);

	private readonly $actualTime = new Subject<string>();
	private readonly actualTime$ = debounce('actualTime', this.$actualTime);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changedDetectorRef: ChangeDetectorRef,
	) {
		this.scheduledDate$.subscribe(date => this.setDateField('scheduledDate', date));
		this.scheduledTime$.subscribe(date => this.setTimeField('scheduledTime', date));
		this.actualDate$.subscribe(date => this.setDateField('actualDate', date));
		this.actualTime$.subscribe(date => this.setTimeField('actualTime', date));
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

	protected onScheduledDateChanged(event: Event): void {
		console.log('ContainerEndpointComponent.onScheduledDateChanged()', event);
		this.$scheduledDate.next(this.scheduledDate.value || '');
	}

	protected onScheduledTimeChanged(event: Event): void {
		console.log('ContainerEndpointComponent.onScheduledTimeChanged()', event);
		this.$scheduledTime.next(this.scheduledTime.value || '');
	}

	protected onActualDateChanged(event: Event): void {
		console.log('ContainerEndpointComponent.onActualDateChanged()', event);
		this.$actualDate.next(this.actualDate.value || '');
	}

	protected onActualTimeChanged(event: Event): void {
		console.log('ContainerEndpointComponent.onActualTimeChanged()', event);
		this.$actualTime.next(this.actualTime.value || '');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerPoint'] || changes['endpointSide']) {
			switch (this.endpointSide) {
				case 'arrival':
					this.labelActual = 'Arrives';
					break;
				case 'departure':
					this.labelActual = 'Departs';
					break;
				default:
					this.labelActual = 'Endpoint Side';
					break;
			}
			this.endpoint = this.endpointSide ? this.containerPoint?.[this.endpointSide] : undefined;
			console.log('ContainerEndpointComponent.ngOnChanges()', this.endpointSide, this.endpoint);

			this.scheduledDate.setValue(this.endpoint?.scheduledDate || '');
			this.scheduledTime.setValue(this.endpoint?.scheduledTime || '');
			this.actualDate.setValue(this.endpoint?.actualDate || '');
			this.actualTime.setValue(this.endpoint?.actualTime || '');

			// this.actualDate.setValue(this.endpoint?.actualDate || '');
			const byCounterparty = this.order?.dto?.counterparties?.find(c => c.contactID === this.endpoint?.byContactID);
			if (this.team) {
				this.byContact = byCounterparty && {
					id: byCounterparty?.contactID,
					brief: {
						type: 'company',
						title: byCounterparty.title,
						countryID: byCounterparty.countryID,
					},
					team: this.team,
				};
			}
		}
	}

	private createSetContainerEndpointFieldsRequest(): ISetContainerEndpointFieldsRequest {
		const
			endpointSide = this.endpointSide,
			shippingPointID = this.shippingPointID,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!endpointSide || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			throw new Error(`ContainerEndpointComponent.createSetContainerEndpointFieldsRequest(): invalid parameters: endpointSide=${endpointSide}, containerID=${containerID}, shippingPointID=${shippingPointID}, orderID=${orderID}, teamID=${teamID}`);
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

	private readonly setTimeField = (field: EndpointTimeField, value: string): void => {
		if (value === (this.endpoint?.[field])) {
			return;
		}
		console.log(`ContainerEndpointComponent.setDateField(${field}, ${value})`, `endpoint.${field}`, this.endpoint?.[field]);
		const request = this.createSetContainerEndpointFieldsRequest();
		this.setContainerEndpointFields({...request, times: { [field]: value }})

	}

	private readonly setDateField = (field: EndpointDateField, value: string): void => {
		if (value === (this.endpoint?.[field])) {
			return;
		}
		console.log(`ContainerEndpointComponent.setDateField(${field}, ${value})`, `endpoint.${field}`, this.endpoint?.[field]);
		const request = this.createSetContainerEndpointFieldsRequest();
		this.setContainerEndpointFields({...request, dates: { [field]: value }})
	};

	private setContainerEndpointFields(request: ISetContainerEndpointFieldsRequest): void {
		this.orderService.setContainerEndpointFields(request).subscribe({
			next: () => {
				console.log('ContainerEndpointComponent.setContainerEndpointFields() success');
			},
			error: err => {
				this.errorLogger.logError(err, `Failed to set container point fields: ${request}`);
				this.scheduledDate.reset();
				this.changedDetectorRef.detectChanges();
			},
		});
	}

}
