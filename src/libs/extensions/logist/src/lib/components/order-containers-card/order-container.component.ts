import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import {
	IContainerPoint,
	IContainerRequest,
	IContainerSegment,
	IFreightLoad,
	ILogistOrderContext,
	IOrderContainer,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { NewSegmentService } from '../new-segment/new-segment.service';
import { INewShippingPointParams, NewShippingPointService } from '../new-shipping-point/new-shipping-point.service';
import { ShippingPointsSelectorService } from '../shipping-points-selector/shipping-points-selector.service';

@Component({
	selector: 'sneat-order-container',
	templateUrl: './order-container.component.html',
	// changeDetection: ChangeDetectionStrategy.Default,
})
export class OrderContainerComponent implements OnChanges {
	@Input() container?: IOrderContainer;
	@Input() order?: ILogistOrderContext;
	@Input() team?: ITeamContext;
	@Input() i?: number;

	protected tab: 'points' | 'route' = 'points';

	protected containerSegments?: IContainerSegment[];
	protected containerPoints?: IContainerPoint[];

	protected deleting = false;

	protected number = new FormControl<string>('');

	protected containerFormGroup = new FormGroup({
		number: this.number,
	});

	protected containerPointKey(_: number, containerPoint: IContainerPoint): string {
		return `${containerPoint.containerID}-${containerPoint.shippingPointID}`;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly newSegmentService: NewSegmentService,
		private readonly shippingPointsSelectorService: ShippingPointsSelectorService,
		private readonly newShippingPointService: NewShippingPointService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['container']) {
			this.setFormValues();
		}
		if (changes['order'] || changes['container']) {
			const containerID = this.container?.id;
			this.containerSegments = containerID ? this.order?.dto?.segments?.filter(s => s.containerID === containerID) : undefined;
			console.log('containerID', containerID, 'containerSegments', this.containerSegments);
			this.containerPoints = containerID ? this.order?.dto?.containerPoints?.filter(cp => cp.containerID === containerID) : undefined;
			if (containerID) {
				if (!this.containerPoints) {
					this.containerPoints = [];
				}
				if (!this.containerSegments) {
					this.containerSegments = [];
				}
			}
			if (this.containerPoints?.length && this.container) {
				this.container = {
					...this.container,
					...this.containerPoints.reduce((total, cp) => ({
						totalLoad: {
							numberOfPallets: (total.totalLoad.numberOfPallets || 0) + (cp.toLoad?.numberOfPallets || 0),
							grossWeightKg: (total.totalLoad.grossWeightKg || 0) + (cp.toLoad?.grossWeightKg || 0),
							volumeM3: (total.totalLoad.volumeM3 || 0) + (cp.toLoad?.volumeM3 || 0),
						},
						totalUnload: {
							numberOfPallets: (total.totalUnload.numberOfPallets || 0) + (cp.toUnload?.numberOfPallets || 0),
							grossWeightKg: (total.totalUnload.grossWeightKg || 0) + (cp.toUnload?.grossWeightKg || 0),
							volumeM3: (total.totalUnload.volumeM3 || 0) + (cp.toUnload?.volumeM3 || 0),
						},
					}), { totalLoad: {} as IFreightLoad, totalUnload: {} as IFreightLoad }),
				};
			}
		}
	}

	setFormValues(): void {
		this.number.setValue(this.container?.number || '');
	}

	cancelEditing(event: Event): void {
		console.log('cancelEditing()');
		event.stopPropagation();
		event.preventDefault();
		this.setFormValues();
		setTimeout(() => {
			this.containerFormGroup.markAsPristine();
		}, 100);
	}

	save(event: Event): void {
		console.log('save()');
		event.stopPropagation();
		event.preventDefault();
		this.containerFormGroup.markAsPending();
		setTimeout(() => {
			this.containerFormGroup.markAsPristine();
		}, 100);
	}

	delete(event: Event): void {
		console.log('delete()', this.container);
		event.stopPropagation();
		event.preventDefault();
		if (!this.container) {
			this.errorLogger.logError('ContainerFormComponent.delete(): container is undefined');
			return;
		}
		if (!this.order) {
			this.errorLogger.logError('ContainerFormComponent.delete(): order is undefined');
			return;
		}
		if (!this.team) {
			this.errorLogger.logError('ContainerFormComponent.delete(): team is undefined');
			return;
		}
		const request: IContainerRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			containerID: this.container.id,
		};
		this.deleting = true;
		this.orderService.deleteContainer(request).subscribe({
			next: () => {
				this.deleting = false;
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete container');
				this.deleting = false;
			},
		});
	}

	addPoints(event: Event): void {
		console.log('addPoints()');
		event.stopPropagation();
		event.preventDefault();
		const order = this.order;
		const container = this.container;
		if (!order || !container) {
			return;
		}
		if (order.dto?.shippingPoints?.length === 0) {
			this.shippingPointsSelectorService.selectShippingPointsInModal(order, container)
				.then(points => console.log('points', points))
				.catch(this.errorLogger.logErrorHandler('Failed to select shipping points'));
		} else {
			const props: INewShippingPointParams = {
				order: order,
				container: this.container,
			};
			this.newShippingPointService.openNewShippingPointDialog(props)
				.then(modal => {
					// this.modal = modal;
					// modal.onDidDismiss().then(() => {
					// 	this.modal = undefined;
					// });
				})
				.catch(this.errorLogger.logErrorHandler('Failed to open new shipping point form'));
		}
	}

	async addSegment(event: Event): Promise<void> {
		console.log('addSegment()', event);
		event.stopPropagation();
		event.preventDefault();
		if (!this.order) {
			return;
		}
		await this.newSegmentService.openNewSegmentDialog({
			order: this.order,
			container: this.container,
		});
	}
}
