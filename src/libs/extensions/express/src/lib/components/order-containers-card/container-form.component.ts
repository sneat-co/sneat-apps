import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { ExpressOrderService, IContainerRequest, IExpressOrderContext, IOrderContainer, IOrderSegment } from '../..';
import { NewSegmentService } from '../new-segment/new-segment.service';

@Component({
	selector: 'sneat-order-container-form',
	templateUrl: './container-form.component.html',
})
export class ContainerFormComponent implements OnChanges {
	@Input() container?: IOrderContainer;
	@Input() order?: IExpressOrderContext;
	@Input() team?: ITeamContext;
	@Input() i = 0;

	segments?: IOrderSegment[];

	deleting = false;

	number = new FormControl<string>('');
	grossKg = new FormControl<number | undefined>({ value: undefined, disabled: true });
	pallets = new FormControl<number | undefined>({ value: undefined, disabled: true });

	containerFormGroup = new FormGroup({
		number: this.number,
		grossKg: this.grossKg,
		pallets: this.pallets,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
		private readonly newSegmentService: NewSegmentService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['container']) {
			this.setFormValues();
		}
		if (changes['order'] || changes['container']) {
			const containerID = this.container?.id;
			this.segments = containerID ? this.order?.dto?.segments?.filter(s => s.containerID === containerID) || [] : undefined;
		}
	}

	setFormValues(): void {
		this.number.setValue(this.container?.number || '');
		this.grossKg.setValue(this.container?.grossWeightKg);
		this.pallets.setValue(this.container?.numberOfPallets);
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

	async addSegment(): Promise<void> {
		console.log('addSegment()');
		if (!this.order) {
			return;
		}
		await this.newSegmentService.addSegment({
			order: this.order,
			container: this.container,
		});
	}
}
