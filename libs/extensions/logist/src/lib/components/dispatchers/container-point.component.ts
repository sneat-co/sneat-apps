import { NgIf } from '@angular/common';
import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
	IonSpinner,
} from '@ionic/angular/standalone';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	getSegmentCounterparty,
	getSegmentsByContainerID,
	IContainerPoint,
	IContainerSegment,
	IFreightLoad,
	ILogistOrderContext,
	IOrderContainer,
	IOrderCounterparty,
	IOrderShippingPoint,
	IUpdateContainerPointRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';
import {
	FreightLoadForm,
	FreightLoadFormComponent,
} from '../freight-load-form/freight-load-form.component';

@Component({
	selector: 'sneat-container-point',
	templateUrl: './container-point.component.html',
	imports: [
		IonCard,
		ReactiveFormsModule,
		IonItem,
		IonLabel,
		IonInput,
		IonButtons,
		IonButton,
		IonSpinner,
		IonIcon,
		IonGrid,
		IonRow,
		IonCol,
		NgIf,
		FreightLoadFormComponent,
	],
})
export class ContainerPointComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Input() shippingPoint?: IOrderShippingPoint;
	@Input() container?: IOrderContainer;

	saving = false;

	arriveSegment?: IContainerSegment;
	departSegment?: IContainerSegment;

	truckerTo?: IOrderCounterparty;
	truckerFrom?: IOrderCounterparty;

	containerPoint?: IContainerPoint;

	readonly freightLoadForm = new FreightLoadForm();

	numberOfPallets = new FormControl<number | undefined>(undefined);
	grossWeightKg = new FormControl<number | undefined>(undefined);
	volumeM3 = new FormControl<number | undefined>(undefined);

	arrivesOn = new FormControl<string>('');
	leavesOn = new FormControl<string>('');

	containerForm = new FormGroup({
		freightLoad: this.freightLoadForm.group,
		arrivesOn: this.arrivesOn,
		leavesOn: this.leavesOn,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactsSelectorService,
		private readonly ordersService: LogistOrderService,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['container'] || changes['shippingPoint']) {
			const containerID = this.container?.id;
			const shippingPointID = this.shippingPoint?.id;
			this.containerPoint = this.order?.dbo?.containerPoints?.find(
				(cp) =>
					cp.containerID === containerID &&
					cp.shippingPointID === shippingPointID,
			);
			if (!this.numberOfPallets.dirty) {
				this.numberOfPallets.setValue(
					this.containerPoint?.toLoad?.numberOfPallets || undefined,
				);
			}
			if (!this.grossWeightKg.dirty) {
				this.grossWeightKg.setValue(
					this.containerPoint?.toLoad?.grossWeightKg || undefined,
				);
			}
			if (!this.volumeM3.dirty) {
				this.volumeM3.setValue(
					this.containerPoint?.toLoad?.volumeM3 || undefined,
				);
			}

			const containerSegments = getSegmentsByContainerID(
				this.order?.dbo?.segments,
				this.container?.id,
			);
			this.arriveSegment = containerSegments?.find(
				(s) => s.to?.shippingPointID === this.shippingPoint?.id,
			);
			this.departSegment = containerSegments?.find(
				(s) => s.from?.shippingPointID === this.shippingPoint?.id,
			);

			if (this.arriveSegment?.dates?.end) {
				this.arrivesOn.setValue(this.arriveSegment.dates.end);
			}
			if (this.departSegment?.dates?.start) {
				this.arrivesOn.setValue(this.departSegment.dates.start);
			}

			this.truckerTo = getSegmentCounterparty(
				this.order?.dbo,
				this.arriveSegment,
			);
			this.truckerFrom = getSegmentCounterparty(
				this.order?.dbo,
				this.departSegment,
			);
		}

		console.log(
			'ContainerPointComponent.ngOnChanges',
			'order',
			this.order,
			'container',
			this.container,
			'shippingPoint',
			this.shippingPoint,
			'arriveSegment',
			this.arriveSegment,
			'truckerTo',
			this.truckerTo,
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
			toPick = { ...toPick, numberOfPallets: pallets };
		}

		const grossKg = this.grossWeightKg.value;
		if (grossKg || grossKg === 0) {
			toPick = { ...toPick, grossWeightKg: grossKg };
		}

		const request: IUpdateContainerPointRequest = {
			spaceID: this.order.space.id,
			orderID: this.order.id,
			shippingPointID: this.shippingPoint.id,
			containerID: this.container?.id,
			toLoad: toPick,
		};
		this.saving = true;
		this.containerForm.disable();
		try {
			this.ordersService.updateContainerPoint(request).subscribe({
				next: () => {
					this.containerForm.markAsPristine();
					this.containerForm.enable();
				},
				error: (err) => {
					this.errorLogger.logError(err, 'Failed to update segment');
					this.containerForm.enable();
				},
			});
		} catch {
			this.saving = false;
		}
	}

	onFreightLoadChange(freightLoad?: IFreightLoad): void {
		console.log('ContainerPointComponent.onFreightLoadChange', freightLoad);
	}
}
