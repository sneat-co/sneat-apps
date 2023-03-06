import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import {
	LogistOrderService,
	IContainerRequest,
	ILogistOrderContext,
	IOrderContainer,
	IContainerSegment,
	IFreightLoad, IContainerPoint,
} from '../..';
import { NewSegmentService } from '../new-segment/new-segment.service';

@Component({
	selector: 'sneat-order-container-form',
	templateUrl: './container-form.component.html',
	// changeDetection: ChangeDetectionStrategy.Default,
})
export class ContainerFormComponent implements OnChanges {
	@Input() container?: IOrderContainer;
	@Input() order?: ILogistOrderContext;
	@Input() team?: ITeamContext;
	@Input() i = 0;

	protected tab: 'points' | 'segments' = 'points';

	protected containerSegments?: IContainerSegment[];
	protected containerPoints?: IContainerPoint[];

	protected deleting = false;

	protected number = new FormControl<string>('');

	protected containerFormGroup = new FormGroup({
		number: this.number,
	});

	protected segmentID(_: number, segment: IContainerSegment): string {
		return segment.containerID + '-' + segment.from.shippingPointID + '-' + segment.to.shippingPointID;
	}

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly newSegmentService: NewSegmentService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['container']) {
			this.setFormValues();
		}
		if (changes['order'] || changes['container']) {
			const containerID = this.container?.id;
			this.containerSegments = containerID ? this.order?.dto?.segments?.filter(s => s.containerID === containerID) : undefined;
			this.containerPoints = containerID ? this.order?.dto?.containerPoints?.filter(cp => cp.containerID === containerID && this.containerSegments?.some(s => s.from.shippingPointID === cp.shippingPointID)) : undefined;
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
						numberOfPallets: (total.numberOfPallets || 0) + (cp.toLoad?.numberOfPallets || 0),
						grossWeightKg: (total.grossWeightKg || 0) + (cp.toLoad?.grossWeightKg || 0),
						volumeM3: (total.volumeM3 || 0) + (cp.toLoad?.volumeM3 || 0),
					}), {} as IFreightLoad),
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
		alert('not implemented yet');
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
