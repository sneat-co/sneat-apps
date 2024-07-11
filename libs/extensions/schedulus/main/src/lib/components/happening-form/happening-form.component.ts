import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	FormControl,
	FormsModule,
	ReactiveFormsModule,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { RoutingState } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	HappeningType,
	IHappeningContext,
	IHappeningDbo,
	IHappeningSlot,
	IHappeningSlotWithID,
	mergeValuesWithIDs,
	WeekdayCode2,
} from '@sneat/mod-schedulus-core';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { ISpaceContext } from '@sneat/team-models';
import {
	HappeningService,
	HappeningServiceModule,
	ICancelHappeningRequest,
} from '@sneat/team-services';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { HappeningParticipantsComponent } from '../happening-participants/happening-participants.component';
import { HappeningSlotFormComponent } from '../happening-slot-form/happening-slot-form.component';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';
import { HappeningPricesComponent } from './happening-prices/happening-prices.component';

@Component({
	selector: 'sneat-happening-form',
	templateUrl: 'happening-form.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		SneatPipesModule,
		HappeningServiceModule,
		HappeningParticipantsComponent,
		HappeningPricesComponent,
		HappeningSlotFormComponent,
		HappeningSlotsComponent,
	],
})
export class HappeningFormComponent
	extends SneatBaseComponent
	implements OnChanges, AfterViewInit
{
	// @Input() public initialHappeningType?: HappeningType;
	@Input() public wd?: WeekdayCode2;
	@Input() public date?: string;

	@Input({ required: true }) public team?: ISpaceContext;
	@Input({ required: true }) public happening?: IHappeningContext;
	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();
	@Input() public contactusTeam?: IContactusSpaceDboAndID;

	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;
	@ViewChild('happeningSlotsComponent', { static: false })
	happeningSlotsComponent?: HappeningSlotsComponent;

	protected readonly isCreating = signal(false);
	protected readonly isCancelling = signal(false);
	protected readonly isDeleting = signal(false);

	// public get slots(): readonly IHappeningSlot[] | undefined {
	// 	return this.happening?.brief?.slots;
	// }

	protected readonly slots = signal<IHappeningSlotWithID[] | undefined>(
		undefined,
	);

	public happeningTitle = new FormControl<string>('', Validators.required);
	protected happeningType = new FormControl<HappeningType>(
		'recurring',
		Validators.required,
	);

	public happeningForm = new UntypedFormGroup({
		title: this.happeningTitle,
	});

	public singleSlot?: IHappeningSlot;

	private readonly logErrorHandler = this.errorLogger.logErrorHandler;
	private readonly logError = this.errorLogger.logError;
	private readonly hasNavHistory: boolean;

	public isToDo = false;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		routingState: RoutingState,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly happeningService: HappeningService,
		private readonly params: TeamComponentBaseParams,
	) {
		super('', errorLogger);
		this.hasNavHistory = routingState.hasHistory();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			const happeningType = this.happening?.brief?.type;
			if (happeningType) {
				this.happeningType.setValue(happeningType);
			}
			if (this.happening?.brief?.title && this.happeningTitle.untouched) {
				this.happeningTitle.setValue(this.happening?.brief?.title);
				// this.slots = this?.happening?.brief?.slots || [];
			}
			this.slots.set(mergeValuesWithIDs(this.happening?.brief?.slots));
		}
	}

	ngAfterViewInit(): void {
		console.log('HappeningFormComponent.ngAfterViewInit()');
		this.setFocusToInput(this.titleInput);
	}

	protected onHappeningTypeChanged(event: Event): void {
		console.log('onHappeningTypeChanged()', event);
		const happeningType = (event as CustomEvent).detail.value as HappeningType;
		if (this.happening?.brief) {
			this.happening = {
				...this.happening,
				brief: { ...this.happening?.brief, type: happeningType },
			};
		}

		// const setSlots = (slots?: IHappeningSlot[]) => {
		//    if (slots && this.happening?.brief) {
		//       this.happening = {
		//          ...this.happening,
		//          brief: {
		//             ...this.happening.brief,
		//             slots,
		//          },
		//       };
		//    }
		// };
		//
		// switch (happeningType) {
		//    case 'single':
		//       setSlots(this.happening?.brief?.slots);
		//       break;
		//    case 'recurring':
		//       setSlots(this.happening?.brief?.slots);
		//       break;
		// }

		this.happeningChange.emit(this.happening);
	}

	protected onTitleEnter(event: Event): void {
		console.log('onTitleEnter()', event);
		this.changeDetectorRef.markForCheck();
	}

	ionViewDidEnter(): void {
		if (!this.titleInput) {
			this.logError(new Error('titleInput is not initialized'));
			return;
		}
		this.titleInput
			.setFocus()
			.catch(this.logErrorHandler('failed to set focus to title input'));
	}

	// onAddSlotModalDismissed(): void {
	// 	console.log('NewHappeningPage.onAddSlotModalDismissed()');
	// 	if (!this.titleInput?.value) {
	// 		if (this.titleInput) {
	// 			setTimeout(() => {
	// 				this.titleInput?.setFocus().catch(this.logErrorHandler('failed to set focus to title input'));
	// 			}, 50);
	// 		} else {
	// 			console.warn('View child #titleInput is not initialized');
	// 		}
	// 	}
	// }

	protected onSlotAdded(slot: IHappeningSlot): void {
		console.log('onSlotAdded()', slot, this.happening);
		this.happeningForm.markAllAsTouched();
	}

	protected onHappeningChanged(happening: IHappeningContext): void {
		console.log('HappeningFormComponent.onHappeningChanged()', happening);
		this.happening = happening;
		this.happeningForm.markAllAsTouched(); // TODO: Document why we need it and if we can remove it
		this.happeningChange.emit(happening);
	}

	protected onSingleSlotChanged(slot: IHappeningSlot): void {
		console.log('NewHappeningPageComponent.onTimingChanged()', slot);
		this.singleSlot = slot;
	}

	protected formIsValid(): boolean {
		if (!this.happeningForm.valid) {
			return false;
		}
		return !!this.slots()?.length;
	}

	private makeHappeningDbo(): IHappeningDbo {
		if (!this.team) {
			throw new Error('!this.team');
		}
		if (!this.happening) {
			throw new Error('!this.happening');
		}
		if (!this.happening.brief) {
			throw new Error('!this.happening.brief');
		}
		const activityFormValue = this.happeningForm.value;
		// switch (dto.type) {
		// 	case 'recurring':
		// 		// dto.slots = this.slots.map(slot => ({ ...slot, repeats: 'weekly', id: slot.id || newRandomId({ len: 5 }) }));
		// 		break;
		// 	case 'single':
		// 		if (!this.singleSlot) {
		// 			throw new Error('timing is not set');
		// 		}
		// 		dto.slots = [{
		// 			...this.singleSlot,
		// 			id: 'once',
		// 			repeats: 'once',
		// 		}];
		// 		break;
		// 	default:
		// 		throw new Error('unknown happening type: ' + dto.type);
		// }

		return {
			...this.happening.dbo,
			...this.happening.brief,
			spaceIDs: [this.team.id], // TODO: should be already in this.happening.brief
			title: activityFormValue.title, // TODO: should be already in this.happening.brief
		};
	}

	protected submit(): void {
		if (this.happening?.id) {
			// Update happening
		} else {
			//Create happening
			this.createHappening();
		}
	}

	private createHappening(): void {
		console.log('NewHappeningPageComponent.createHappening()');
		if (!this.team) {
			return;
		}
		try {
			// this.happeningForm.markAsTouched();
			// if (!this.happeningForm.valid) {
			// 	alert('title is a required field');
			// 	// if (!this.happeningForm.controls['title'].valid) {
			// 	// 	this.titleInput?.setFocus()
			// 	// 		.catch(this.logErrorHandler('failed to set focus to title input after happening found to be not valid'));
			// 	// }
			// 	return;
			// }
			const team = this.team;

			if (!team) {
				this.logError(new Error('!team context'));
				return;
			}

			this.isCreating.set(true);

			let happening = this.makeHappeningDbo();

			switch (happening.type) {
				case 'single':
					happening = {
						...happening,
						slots: Object.fromEntries(
							Object.entries(happening.slots || {}).map(([id, data]) => [
								id,
								{ ...data, repeats: 'once' },
							]),
						),
					};
					break;
			}

			this.happeningService
				.createHappening({ spaceID: team.id, happening })
				.pipe(takeUntil(this.destroyed$))
				.subscribe({
					next: () => {
						console.log('new happening created');
						if (this.hasNavHistory) {
							this.params.navController
								.pop()
								.catch(
									this.logErrorHandler(
										'failed to pop back after creating a happening',
									),
								);
						} else {
							this.params.teamNavService
								.navigateBackToTeamPage(team, 'calendar')
								.catch(
									this.logErrorHandler(
										'failed to team schedule after creating a happening',
									),
								);
						}
					},
					error: (err: unknown) => {
						this.isCreating.set(false);
						this.logError(err, 'API request failed to create new happening');
					},
					complete: () => {
						this.isCreating.set(false);
					},
				});
		} catch (e) {
			this.isCreating.set(false);
			this.errorLogger.logError(e, 'failed to create new happening');
		}
	}

	protected cancel(): void {
		const request: ICancelHappeningRequest = {
			spaceID: this.team?.id || '',
			happeningID: this.happening?.id || '',
		};
		this.isCancelling.set(true);
		this.happeningService.cancelHappening(request).subscribe({
			next: () => this.isCancelling.set(false),
			error: (err) => {
				this.errorLogger.logError(err, 'failed to cancel happening');
				this.isCancelling.set(false);
			},
			// complete: () => this.isCancelling.set(false), -- TODO(help-wanted): Why is not working?
		});
	}

	protected delete(): void {
		if (!this.happening) {
			return;
		}
		this.isDeleting.set(true);
		this.happeningService.deleteHappening(this.happening).subscribe({
			next: () => this.isDeleting.set(false),
			error: (err) => {
				this.errorLogger.logError(err, 'failed to delete happening');
				this.isDeleting.set(false);
			},
		});
	}
}
