import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { set } from '@angular/fire/database';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactSelectorService } from '@sneat/extensions/contactus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ExpressOrderService, getSegmentCounterparty, getSegmentsByContainerID,
	IExpressOrderContext,
	IOrderContainer,
	IOrderCounterparty,
	IContainerSegment,
	IOrderShippingPoint, IUpdateShippingPointRequest, IUpdateContainerPointRequest, IFreightLoad, IContainerPoint,
} from '../..';

@Component({
	selector: 'sneat-container-point',
	templateUrl: './container-point.component.html',
})
export class ContainerPointComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() shippingPoint?: IOrderShippingPoint;
	@Input() container?: IOrderContainer;

	saving = false;

	arriveSegment?: IContainerSegment;
	departSegment?: IContainerSegment;

	truckerTo?: IOrderCounterparty;
	truckerFrom?: IOrderCounterparty;

	containerPoint?: IContainerPoint;

	numberOfPallets = new FormControl<number | undefined>(undefined);
	grossWeightKg = new FormControl<number | undefined>(undefined);
	volumeM3 = new FormControl<number | undefined>(undefined);

	arrivesOn = new FormControl<string>('');
	leavesOn = new FormControl<string>('');

	containerForm = new FormGroup({
		numberOfPallets: this.numberOfPallets,
		grossWeightKg: this.grossWeightKg,
		volumeM3: this.volumeM3,
		arrivesOn: this.arrivesOn,
		leavesOn: this.leavesOn,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: ExpressOrderService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['container'] || changes['shippingPoint']) {
			this.containerPoint = this.order?.dto?.containerPoints?.find(cp => cp.containerID === this.container?.id);
			if (this.containerPoint) {
				if (!this.numberOfPallets.dirty && this?.containerPoint?.toPick?.numberOfPallets) {
					this.numberOfPallets.setValue(this.containerPoint.toPick.numberOfPallets);
				}
				if (!this.grossWeightKg.dirty && this?.containerPoint?.toPick?.grossWeightKg) {
					this.grossWeightKg.setValue(this.containerPoint.toPick.grossWeightKg);
				}
				if (!this.volumeM3.dirty && this?.containerPoint?.toPick?.volumeM3) {
					this.volumeM3.setValue(this.containerPoint.toPick.volumeM3);
				}
			}

			const containerSegments = getSegmentsByContainerID(this.order?.dto?.segments, this.container?.id);
			this.arriveSegment = containerSegments?.find(s => s.to?.shippingPointID === this.shippingPoint?.id);
			this.departSegment = containerSegments?.find(s => s.from?.shippingPointID === this.shippingPoint?.id);

			if (this.arriveSegment?.dates?.end) {
				this.arrivesOn.setValue(this.arriveSegment.dates.end);
			}
			if (this.departSegment?.dates?.start) {
				this.arrivesOn.setValue(this.departSegment.dates.start);
			}

			this.truckerTo = getSegmentCounterparty(this.order?.dto, this.arriveSegment);
			this.truckerFrom = getSegmentCounterparty(this.order?.dto, this.departSegment);
		}

		console.log('ContainerPointComponent.ngOnChanges',
			'order', this.order,
			'container', this.container,
			'shippingPoint', this.shippingPoint,
			'arriveSegment', this.arriveSegment,
			'truckerTo', this.truckerTo,
		);
	}

	excludeContainerFromSegment(): void {
		alert('not implemented yet');
	}

	assignContainerToSegment(): void {
		alert('not implemented yet');
	}

	saveChanges(): void {
		if (this.saving || !this.order || !this.shippingPoint || !this.container) {
			return;
		}
		let toPick: IFreightLoad = {};

		const pallets = this.numberOfPallets.value;
		if (pallets || pallets === 0) {
			toPick = {...toPick, numberOfPallets: pallets};
		}

		const grossKg = this.grossWeightKg.value;
		if (grossKg || grossKg === 0) {
			toPick = {...toPick, grossWeightKg: grossKg};
		}

		const request: IUpdateContainerPointRequest = {
			teamID: this.order.team.id,
			orderID: this.order.id,
			shippingPointID: this.shippingPoint.id,
			containerID: this.container?.id,
			toPick,
		};
		this.saving = true;
		this.containerForm.disable()
		try {
			this.ordersService.updateContainerPoint(request).subscribe({
				next: () => {
					this.containerForm.markAsPristine();
					this.containerForm.enable();
				},
				error: err => {
					this.errorLogger.logError(err,'Failed to update segment');
					this.containerForm.enable();
				}
			})
		} catch (e) {
			this.saving = false;
		}
	}
}
