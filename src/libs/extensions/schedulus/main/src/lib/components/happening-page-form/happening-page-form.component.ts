import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
import { RoutingState } from '@sneat/core';
import { HappeningType, IHappeningDto, IHappeningSlot, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IContactusTeamDtoWithID, IHappeningContext, ITeamContext } from '@sneat/team/models';
import { HappeningService } from '@sneat/team/services';
import { Subject, takeUntil } from 'rxjs';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';

@Component({
	selector: 'sneat-happening-page-form',
	templateUrl: 'happening-page-form.component.html',
})
export class HappeningPageFormComponent implements OnChanges, AfterViewInit, OnDestroy {

	private readonly destroyed = new Subject<void>();

	public readonly changed = new EventEmitter<IHappeningContext>();

	date = '';

	isCreating = false;

	@Input() public team?: ITeamContext;
	@Input() public contactusTeam?: IContactusTeamDtoWithID;
	@Input() public happening?: IHappeningContext;
	@Input() public wd?: WeekdayCode2;

	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	@ViewChild('titleInput', { static: true }) titleInput?: IonInput;
	@ViewChild('happeningSlotsComponent', { static: false }) happeningSlotsComponent?: HappeningSlotsComponent;

	get happeningType(): HappeningType | undefined {
		return this.happening?.brief?.type;
	}

	public get slots(): IHappeningSlot[] | undefined {
		return this.happening?.brief?.slots;
	}

	public happeningTitle = new FormControl<string>('', Validators.required);
	public happeningForm = new UntypedFormGroup({
		title: this.happeningTitle,
	});

	public singleSlot?: IHappeningSlot;

	private readonly logErrorHandler = this.errorLogger.logErrorHandler;
	private readonly logError = this.errorLogger.logError;
	private readonly hasNavHistory: boolean;

	public isToDo = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		routingState: RoutingState,
		private readonly happeningService: HappeningService,
		private readonly params: TeamComponentBaseParams,
	) {
		this.hasNavHistory = routingState.hasHistory();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['happening']) {
			if (this.happening?.brief?.title) {
				this.happeningTitle.setValue(this.happening?.brief?.title);
				// this.slots = this?.happening?.brief?.slots || [];
			}
		}
	}

	ngAfterViewInit(): void {
		if (this.happeningType === 'recurring' && !this.slots?.length) {
			if (this.happeningSlotsComponent) {
				this.happeningSlotsComponent?.showAddSlot({ wd: this.wd });
			} else {
				console.warn('happeningSlotsComponent is not found');
			}
		}
	}


	onTitleEnter(): void {
		//
	}

	ionViewDidEnter(): void {
		if (!this.titleInput) {
			this.logError(new Error('titleInput is not initialized'));
			return;
		}
		this.titleInput.setFocus()
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


	onSlotAdded(slot: IHappeningSlot): void {
		console.log('onSlotAdded()', slot, this.happening);
		this.happeningForm.markAllAsTouched();
	}

	onHappeningChanged(happening: IHappeningContext): void {
		this.happening = happening;
		this.happeningForm.markAllAsTouched();
		this.happeningChange.emit(happening);
	}

	onSingleSlotChanged(slot: IHappeningSlot): void {
		console.log('NewHappeningPageComponent.onTimingChanged()', slot);
		this.singleSlot = slot;
	}


	formIsValid(): boolean {
		if (!this.happeningForm.valid) {
			return false;
		}
		if (!this.slots?.length) {
			return false;
		}
		return true;
	}


	private makeHappeningDto(): IHappeningDto {
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
		const dto: IHappeningDto = {
			...this.happening.dto,
			...this.happening.brief,
			teamIDs: [this.team.id], // TODO: should be already in this.happening.brief
			title: activityFormValue.title, // TODO: should be already in this.happening.brief
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

	submit(): void {
		if (this.happening?.id) {
			// Update happening
		} else {
			//Create happening
			this.createHappening();
		}
	}

	createHappening(): void {
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

			this.isCreating = true;

			const dto = this.makeHappeningDto();

			this.happeningService
				.createHappening({ teamID: team.id, dto })
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: () => {
						console.log('new happening created');
						if (this.hasNavHistory) {
							this.params.navController.pop()
								.catch(this.logErrorHandler('failed to pop back after creating a happening'));
						} else {
							this.params.teamNavService.navigateBackToTeamPage(team, 'schedule')
								.catch(this.logErrorHandler('failed to team schedule after creating a happening'));
						}
					},
					error: (err: unknown) => {
						this.isCreating = false;
						this.logError(err, 'failed to create new happening');
					},
					complete: () => {
						this.isCreating = false;
					},
				});
		} catch (e) {
			this.isCreating = false;
			this.errorLogger.logError(e, 'failed to create new happening');
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

}
