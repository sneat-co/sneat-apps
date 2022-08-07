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
	IOrderSegment,
	IOrderShippingPoint, IUpdateShippingPointRequest,
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

	arriveSegment?: IOrderSegment;
	departSegment?: IOrderSegment;

	truckerTo?: IOrderCounterparty;
	truckerFrom?: IOrderCounterparty;

	pallets = new FormControl<number | undefined>(undefined);
	grossKg = new FormControl<number | undefined>(undefined);
	arrivesOn = new FormControl<string>('');
	leavesOn = new FormControl<string>('');

	containerForm = new FormGroup({
		pallets: this.pallets,
		grossKg: this.grossKg,
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
			const containerSegments = getSegmentsByContainerID(this.order?.dto?.segments, this.container?.id);
			this.arriveSegment = containerSegments?.find(s => s.to?.shippingPointID === this.shippingPoint?.id);
			this.departSegment = containerSegments?.find(s => s.from?.shippingPointID === this.shippingPoint?.id);

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
		if (!this.order || !this.shippingPoint) {
			return;
		}
		const setNumbers: {[field: string]: number} = {};

		const pallets = this.pallets.value;
		if (pallets || pallets === 0) {
			setNumbers['pallets'] = pallets;
		}

		const grossKg = this.grossKg.value;
		if (grossKg || grossKg === 0) {
			setNumbers['grossKg'] = grossKg;
		}

		const request: IUpdateShippingPointRequest = {
			teamID: this.order.team.id,
			orderID: this.order.id,
			shippingPointID: this.shippingPoint.id,
			setNumbers: setNumbers,
		};
		this.saving = true;
		try {
			this.ordersService.updateSegment(request).subscribe({
				next: () => {
					this.containerForm.markAsPristine();
				},
				error: err => {
					this.errorLogger.logError(err,'Failed to update segment');

				}
			})
		} catch (e) {
			this.saving = false;
		}
	}
}
