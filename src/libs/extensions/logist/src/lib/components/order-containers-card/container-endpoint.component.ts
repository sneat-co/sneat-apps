import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject, tap } from 'rxjs';
import {
	EndpointDateField,
	EndpointSide,
	IContainerEndpoint,
	IContainerPoint,
	ILogistOrderContext, IOrderCounterpartyRef,
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
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;
	@Input() containerPoint?: IContainerPoint;
	@Input() shippingPointID?: string;
	@Input() endpointSide?: EndpointSide;

	protected endpoint?: IContainerEndpoint;
	protected byContact?: IContactContext;

	protected readonly scheduledDate = new FormControl<string>('');
	protected readonly actualDate = new FormControl<string>('');

	protected labelScheduled = 'Scheduled';
	protected labelActual = 'Actual';

	private readonly $scheduledDate = new Subject<string>();
	private readonly scheduledDate$ = debounce('scheduledDate', this.$scheduledDate);

	private readonly $actualDate = new Subject<string>();
	private readonly actualDate$ = debounce('actualDate', this.$actualDate);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changedDetectorRef: ChangeDetectorRef,
	) {
		this.scheduledDate$.subscribe(date => this.setDateField('scheduledDate', date));
		// this.actualDate$.subscribe(date => this.setDateField('actualDate', date));
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

	protected onActualDateChanged(event: Event): void {
		console.log('ContainerEndpointComponent.onActualDateChanged()', event);
		this.$actualDate.next(this.actualDate.value || '');
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
			// this.actualDate.setValue(this.endpoint?.actualDate || '');
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

	private readonly setDateField = (field: EndpointDateField, date: string): void => {
		if (date === (this.endpoint?.[field] || '')) {
			return;
		}
		console.log(`ContainerEndpointComponent.setDateField(${field}, ${date})`, `endpoint.${field}`, this.endpoint?.[field]);
		const request = this.createSetContainerEndpointFieldsRequest();
		if (!request) {
			return;
		}
		this.orderService.setContainerEndpointFields({
			...request,
			dates: { [field]: date },
		}).subscribe({
			next: () => {
				console.log('ContainerEndpointComponent.setContainerEndpointFields() success');
			},
			error: err => {
				this.errorLogger.logError(err, `Failed to set container point ${field} date to ${date}`);
				this.scheduledDate.reset();
				this.changedDetectorRef.detectChanges();
			},
		});
	};

}
