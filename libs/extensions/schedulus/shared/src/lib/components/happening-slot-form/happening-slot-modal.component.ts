import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	OnInit,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonTitle,
	IonToolbar,
	ModalController,
} from '@ionic/angular/standalone';
import {
	emptyHappeningSlot,
	IHappeningAdjustment,
	ITiming,
	IHappeningContext,
	IHappeningSlotWithID,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
// import { HappeningService } from '../../services/happening.service';
import { Subject } from 'rxjs';
import {
	HappeningSlotFormComponent,
	IHappeningSlotFormComponentInputs,
} from './happening-slot-form.component';

@Component({
	selector: 'sneat-slot-modal',
	templateUrl: './happening-slot-modal.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	// providers: [HappeningService],
	imports: [
		HappeningSlotFormComponent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonButtons,
		IonButton,
		IonIcon,
		IonContent,
	],
})
export class HappeningSlotModalComponent
	implements OnChanges, OnDestroy, IHappeningSlotFormComponentInputs, OnInit
{
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalController = inject(ModalController);

	private readonly destroyed = new Subject<void>();

	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) happening: IHappeningContext = {
		id: '',
		space: { id: '' },
	};
	@Input() slot: IHappeningSlotWithID = emptyHappeningSlot;
	@Input() adjustment?: IHappeningAdjustment;

	@Input() dateID?: string; // For re-scheduling recurring event for a specific day

	@Output() readonly happeningSlotChange =
		new EventEmitter<IHappeningSlotWithID>();

	constructor() {
		console.log('SingleSlotFormComponent.constructor()');
	}

	onTimingChanged(timing: ITiming): void {
		console.log('onTimingChanged', timing);
		if (timing == emptyHappeningSlot) {
			return;
		}
		if (!timing.end) {
			this.errorLogger.logError('timing has no end');
			return;
		}
		// if (!timing.durationMinutes) {
		// 	this.errorLogger.logError('timing has no durationMinutes');
		// 	return;
		// }
		this.slot = { ...this.slot, ...timing };
		this.emitHappeningSlotChange();
	}

	protected onHappeningChanged(happening: IHappeningContext): void {
		console.log('onHappeningChanged', happening);
		this.happening = happening;
		this.emitHappeningSlotChange();
	}

	private emitHappeningSlotChange(): void {
		this.happeningSlotChange.emit(this.slot);
	}

	async close(event: Event): Promise<void> {
		event.stopPropagation();
		await this.modalController.dismiss();
	}

	// async save(event: Event): Promise<void> {
	// 	console.log('save()', event);
	// 	event.stopPropagation();
	// 	if (!this.space) {
	// 		this.errorLogger.logError('space context is not set');
	// 		return;
	// 	}
	// 	if (!this.happening) {
	// 		this.errorLogger.logError('happening context is not set');
	// 		return;
	// 	}
	// 	switch (this.happening.brief?.type) {
	// 		case 'single':
	// 	}
	// 	alert('breakpoint');
	// 	if (this.happening?.brief?.type === 'single' || !this.dateID) {
	// 		this.happeningService
	// 			.updateSlot(this.space.id, this.happening.id, this.slot)
	// 			.pipe(takeUntil(this.destroyed))
	// 			.subscribe({
	// 				next: () =>
	// 					this.modalController
	// 						.dismiss()
	// 						.catch(this.errorLogger.logErrorHandler('failed to close modal')),
	// 				error: this.errorLogger.logErrorHandler(
	// 					'Failed to update happening slot',
	// 				),
	// 			});
	// 	} else if (this.happening?.brief?.type === 'recurring' && this.dateID) {
	// 		this.happeningService
	// 			.adjustSlot(this.space.id, this.happening.id, this.slot, this.dateID)
	// 			.pipe(takeUntil(this.destroyed))
	// 			.subscribe({
	// 				next: () =>
	// 					this.modalController
	// 						.dismiss()
	// 						.catch(this.errorLogger.logErrorHandler('failed to close modal')),
	// 				error: this.errorLogger.logErrorHandler(
	// 					'Failed to adjust happening slot',
	// 				),
	// 			});
	// 	}
	// }

	ngOnInit(): void {
		// console.log('HappeningSlotModalComponent.ngOnInit()', this.slot);
		this.processHappening();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			this.processHappening();
		}
	}

	private processHappening(): void {
		// if (this.happening?.brief?.type === 'single') {
		// 	if (this.happening?.brief?.slots?.length === 1) {
		// 		this.singleSlot = this.happening.brief.slots[0];
		// 	}
		// }
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}
}
