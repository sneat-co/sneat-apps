import { NgIf } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCol,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
	IonSegment,
	IonSegmentButton,
	IonSpinner,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	ContainerPointStringField,
	IContainerPoint,
	ILogistOrderContext,
	IOrderShippingPoint,
	ISetContainerPointFieldsRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-order-container-point',
	templateUrl: './order-container-point.component.html',
	imports: [
		IonGrid,
		IonRow,
		IonCol,
		IonItem,
		IonLabel,
		IonInput,
		ReactiveFormsModule,
		IonButtons,
		IonButton,
		NgIf,
		IonIcon,
		IonSegmentButton,
		IonSegment,
		FormsModule,
		IonSpinner,
	],
})
export class OrderContainerPointComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
	// @Input() shippingPoint?: IOrderShippingPoint;
	@Input() containerPoint?: IContainerPoint;

	protected dateTimeTab: 'scheduled' | 'actual' = 'scheduled';

	protected shippingPoint?: IOrderShippingPoint;

	protected readonly notes = new FormControl<string>('');
	protected readonly refNumber = new FormControl<string>('');

	protected deleting = false;
	protected saving = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changeDetector: ChangeDetectorRef,
	) {}

	get showNotes(): boolean {
		return (this.dateTimeTab as string) === 'notes';
	}

	cancelRefNumberChanges(): void {
		this.refNumber.setValue(this.containerPoint?.refNumber || '');
		this.refNumber.markAsPristine();
	}

	cancelNotesChanges(): void {
		this.notes.setValue(this.containerPoint?.notes || '');
		this.notes.markAsPristine();
	}

	onSpecialInstructionsChanged(): void {
		if (this.notes.value === (this.containerPoint?.notes || '')) {
			this.notes.markAsPristine();
		}
	}

	saveRefNumber(event?: Event): void {
		this.saveField('refNumber', this.refNumber, event);
	}

	saveNotes(event?: Event): void {
		this.saveField('notes', this.notes, event);
	}

	saveField(
		name: ContainerPointStringField,
		formControl: FormControl<string | null>,
		event?: Event,
	): void {
		event?.preventDefault();
		event?.stopPropagation();
		const spaceID = this.space?.id,
			orderID = this.order?.id,
			containerID = this.containerPoint?.containerID,
			shippingPointID = this.containerPoint?.shippingPointID;
		if (!spaceID || !orderID || !containerID || !shippingPointID) {
			return;
		}
		const request: ISetContainerPointFieldsRequest = {
			spaceID: spaceID,
			orderID,
			containerID,
			shippingPointID,
			setStrings: { [name]: formControl.value?.trim() || '' },
		};
		this.saving = true;
		const complete = () => {
			this.saving = false;
			this.changeDetector.markForCheck();
		};
		this.orderService.setContainerPointFields(request).subscribe({
			next: () => {
				this.notes.markAsPristine();
				complete();
			},
			error: (err) => {
				this.errorLogger.logError(err, `Failed to save [${name}]`);
				complete();
			},
			// complete, // TODO: does not work for some reason - needs to be fixed
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerPoint'] || changes['order']) {
			this.shippingPoint = this.containerPoint?.shippingPointID
				? this.order?.dbo?.shippingPoints?.find(
						(sp) => sp.id === this.containerPoint?.shippingPointID,
					)
				: undefined;
			if (this.containerPoint) {
				if (!this.notes.dirty) {
					this.notes.setValue(this.containerPoint.notes || '');
				}
				if (!this.refNumber.dirty) {
					this.refNumber.setValue(this.containerPoint.refNumber || '');
				}
			}
		}
	}

	delete(event: Event): void {
		console.log('ContainerPointComponent.delete()', event);
		const spaceID = this.space?.id;
		if (!spaceID) {
			throw new Error(
				'ContainerPointComponent.delete(): spaceID is not defined',
			);
		}
		const orderID = this.order?.id;
		if (!orderID) {
			throw new Error(
				'ContainerPointComponent.delete(): orderID is not defined',
			);
		}
		const containerID = this.containerPoint?.containerID;
		if (!containerID) {
			throw new Error(
				'ContainerPointComponent.delete(): containerPoint is not defined',
			);
		}
		const shippingPointID = this.containerPoint?.shippingPointID;
		if (!shippingPointID) {
			throw new Error(
				'ContainerPointComponent.delete(): shippingPointID is not defined',
			);
		}
		this.deleting = true;
		this.orderService
			.deleteContainerPoints({
				spaceID: spaceID,
				orderID,
				containerID,
				shippingPointIDs: [shippingPointID],
			})
			.subscribe({
				complete: () => {
					this.deleting = false;
				},
				error: this.errorLogger.logErrorHandler(
					'Failed to delete container point',
				),
			});
	}
}
