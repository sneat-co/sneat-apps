import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	computed,
	effect,
	EventEmitter,
	input,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { IonicModule, IonInput } from '@ionic/angular';
import { RoutingState } from '@sneat/core';
import {
	HappeningType,
	IHappeningContext,
	IHappeningDbo,
	IHappeningSlot,
	IHappeningSlotWithID,
	mergeValuesWithIDs,
	WeekdayCode2,
} from '@sneat/mod-schedulus-core';
import { SpaceComponentBaseParams } from '@sneat/space-components';
import { SneatBaseComponent } from '@sneat/ui';
import { takeUntil } from 'rxjs';
import { HappeningParticipantsComponent } from '../happening-participants/happening-participants.component';
import { HappeningSlotFormComponent } from '../happening-slot-form/happening-slot-form.component';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';
import { HappeningPricesComponent } from './happening-prices/happening-prices.component';
import {
	HappeningService,
	HappeningServiceModule,
	ICancelHappeningRequest,
} from '../../services/happening.service';

@Component({
	selector: 'sneat-happening-form',
	templateUrl: 'happening-form.component.html',
	imports: [
		IonicModule,
		FormsModule,
		ReactiveFormsModule,
		HappeningServiceModule,
		HappeningParticipantsComponent,
		HappeningPricesComponent,
		HappeningSlotFormComponent,
		HappeningSlotsComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningFormComponent
	extends SneatBaseComponent
	implements OnChanges, AfterViewInit
{
	public readonly $happening = input.required<IHappeningContext>();
	@Input() public wd?: WeekdayCode2;
	@Input() public date?: string;
	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	// @Input({ required: true }) public space?: ISpaceContext;

	protected readonly $space = computed(() => this.$happening().space);

	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;
	@ViewChild('happeningSlotsComponent', { static: false })
	happeningSlotsComponent?: HappeningSlotsComponent;

	protected readonly $isCreating = signal(false);
	protected readonly $isCancelling = signal(false);
	protected readonly $isDeleting = signal(false);

	protected readonly $slots = computed<IHappeningSlotWithID[] | undefined>(
		() => {
			const happening = this.$happening();
			return happening.brief
				? mergeValuesWithIDs(happening.brief.slots)
				: undefined;
		},
	);

	protected readonly happeningTitle = new FormControl<string>(
		'',
		Validators.required,
	);

	// protected onTitleChange(event: Event): void {
	// 	console.log('onTitleChange()', event);
	// }

	protected readonly happeningType = new FormControl<HappeningType>(
		'recurring',
		Validators.required,
	);

	protected readonly happeningForm = new FormGroup({
		title: this.happeningTitle,
	});

	private readonly hasNavHistory: boolean;

	protected isToDo = false;

	constructor(
		routingState: RoutingState,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly happeningService: HappeningService,
		private readonly params: SpaceComponentBaseParams,
	) {
		super('');
		this.hasNavHistory = routingState.hasHistory();
		effect(() => {
			const happening = this.$happening();
			const happeningType = happening?.brief?.type;
			if (happeningType) {
				this.happeningType.setValue(happeningType);
			}
			if (happening.brief?.title && this.happeningTitle.untouched) {
				this.happeningTitle.setValue(happening?.brief?.title);
				// this.changeDetectorRef.markForCheck();
				// this.slots = this?.happening?.brief?.slots || [];
			}
			// this.changeDetectorRef.markForCheck();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			const happening = this.$happening();
		}
	}

	ngAfterViewInit(): void /* Intentionally not ngOnInit*/ {
		// console.log('HappeningFormComponent.ngAfterViewInit()');
		this.setFocusToInput(this.titleInput);
	}

	protected onHappeningTypeChanged(event: Event): void {
		const happeningType = (event as CustomEvent).detail.value as HappeningType;
		let happening = this.$happening();
		console.log(
			'HappeningFormComponent.onHappeningTypeChanged()',
			happeningType,
			happening,
		);
		happening = {
			...happening,
			brief: {
				...(happening.brief || {
					type: happeningType,
					status: 'draft',
					kind: 'activity',
					title: '',
				}),
				type: happeningType,
			},
		};
		this.happeningChange.emit(happening);

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
	}

	protected onTitleEnter(event: Event): void {
		console.log('onTitleEnter()', event);
		this.changeDetectorRef.markForCheck();
	}

	protected onTitleChanged(event: CustomEvent): void {
		console.log('onTitleChanged()', event);
		const happening = this.$happening();
		if (happening.brief) {
			this.happeningChange.emit({
				...happening,
				brief: { ...happening.brief, title: event.detail.value },
			});
		}
	}

	ionViewDidEnter(): void {
		if (!this.titleInput) {
			this.errorLogger.logError(new Error('titleInput is not initialized'));
			return;
		}
		this.titleInput
			.setFocus()
			.catch(
				this.errorLogger.logErrorHandler('failed to set focus to title input'),
			);
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
		console.log('onSlotAdded()', slot, this.$happening());
		this.happeningForm.markAllAsTouched();
	}

	protected onHappeningChanged(happening: IHappeningContext): void {
		console.log('HappeningFormComponent.onHappeningChanged()', happening);
		// this.happening = happening;
		this.happeningForm.markAllAsTouched(); // TODO: Document why we need it and if we can remove it
		this.happeningChange.emit(happening);
	}

	protected formIsValid(): boolean {
		if (!this.happeningForm.valid) {
			return false;
		}
		return !!this.$slots()?.length;
	}

	private makeHappeningDto(): IHappeningDbo {
		const space = this.$space();
		if (!space) {
			throw new Error('!this.team');
		}
		const happening = this.$happening();
		if (!happening) {
			throw new Error('!this.happening');
		}
		if (!happening.brief) {
			throw new Error('!this.happening.brief');
		}
		const activityFormValue = this.happeningForm.value;
		const dto: IHappeningDbo = {
			...happening.dbo,
			...happening.brief,
			spaceIDs: [space.id], // TODO: should be already in this.happening.brief
			title: activityFormValue.title || '', // TODO: should be already in this.happening.brief
		};
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

		return dto;
	}

	protected submit(): void {
		if (this.$happening()?.id) {
			alert('editing existing happening is not implemented yet');
		} else {
			//Create happening
			this.createHappening();
		}
	}

	private createHappening(): void {
		console.log('NewHappeningPageComponent.createHappening()');
		const space = this.$space();
		if (!space) {
			this.errorLogger.logError(new Error('!space context'));
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

			this.$isCreating.set(true);

			let happening = this.makeHappeningDto();

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
				.createHappening({ spaceID: space.id, happening })
				.pipe(takeUntil(this.destroyed$))
				.subscribe({
					next: () => {
						console.log('new happening created');
						if (this.hasNavHistory) {
							this.params.navController
								.pop()
								.catch(
									this.errorLogger.logErrorHandler(
										'failed to pop back after creating a happening',
									),
								);
						} else {
							this.params.spaceNavService
								.navigateBackToSpacePage(space, 'calendar')
								.catch(
									this.errorLogger.logErrorHandler(
										'failed to navigate to space calendar after creating a happening',
									),
								);
						}
					},
					error: (err: unknown) => {
						this.$isCreating.set(false);
						this.errorLogger.logError(
							err,
							'API request failed to create new happening',
						);
					},
					complete: () => {
						this.$isCreating.set(false);
					},
				});
		} catch (e) {
			this.$isCreating.set(false);
			this.errorLogger.logError(e, 'failed to create new happening');
		}
	}

	protected cancel(): void {
		const space = this.$space();
		const happening = this.$happening();
		const request: ICancelHappeningRequest = {
			spaceID: space.id || '',
			happeningID: happening.id || '',
		};
		this.$isCancelling.set(true);
		this.happeningService.cancelHappening(request).subscribe({
			next: () => this.$isCancelling.set(false),
			error: (err) => {
				this.errorLogger.logError(err, 'failed to cancel happening');
				this.$isCancelling.set(false);
			},
			// complete: () => this.isCancelling.set(false), -- TODO(help-wanted): Why is not working?
		});
	}

	protected delete(): void {
		this.$isDeleting.set(true);
		this.happeningService.deleteHappening(this.$happening()).subscribe({
			next: () => this.$isDeleting.set(false),
			error: (err) => {
				this.errorLogger.logError(err, 'failed to delete happening');
				this.$isDeleting.set(false);
			},
		});
	}
}
