import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ModalController,
  NavController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemGroup,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonCardSubtitle,
  IonButtons,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/angular/standalone';
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
import { takeUntil } from 'rxjs';
import { HappeningTitleModalComponent } from '../../modals/happening-title-modal/happening-title-modal.component';
import { HappeningParticipantsComponent } from '../happening-participants/happening-participants.component';
import { HappeningSlotFormComponent } from '../happening-slot-form/happening-slot-form.component';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';
import { HappeningPricesComponent } from './happening-prices/happening-prices.component';
import {
  HappeningService,
  HappeningServiceModule,
  ICancelHappeningRequest,
} from '../../services/happening.service';
import { WithSpaceInput } from '@sneat/space-services';

@Component({
  imports: [
    ReactiveFormsModule,
    HappeningServiceModule,
    HappeningParticipantsComponent,
    HappeningPricesComponent,
    HappeningSlotFormComponent,
    HappeningSlotsComponent,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonItem,
    IonLabel,
    IonInput,
    IonItemGroup,
    IonButton,
    IonCardHeader,
    IonCardContent,
    IonIcon,
    IonSpinner,
    IonCardSubtitle,
    IonButtons,
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-happening-form',
  templateUrl: 'happening-form.component.html',
})
export class HappeningFormComponent
  extends WithSpaceInput
  implements AfterViewInit
{
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly happeningService = inject(HappeningService);
  private readonly params = inject(SpaceComponentBaseParams);

  public readonly $happening = input.required<IHappeningContext>();
  protected readonly $happeningID = computed(() => this.$happening().id);
  protected readonly $mode = computed<'edit' | 'create'>(() =>
    this.$happeningID() ? 'edit' : 'create',
  );
  protected readonly $hasDescription = computed(
    () => this.$happening().dbo?.description,
  );
  @Input() public wd?: WeekdayCode2;
  @Input() public date?: string;
  @Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

  private readonly navController = inject(NavController);

  // @Input({ required: true }) public space?: ISpaceContext;

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

  private readonly modalController = inject(ModalController);

  protected async editTitle(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: HappeningTitleModalComponent,
      componentProps: {
        happening: this.$happening(),
      },
    });
    await modal.present();
    // const title = (event as CustomEvent).detail.value;
    // this.happeningTitle.setValue(title);
    // const happening = this.$happening();
    // if (happening.brief) {
    // 	this.happeningChange.emit({
    // 		...happening,
    // 		brief: { ...happening.brief, title },
    // 	});
    // }
  }

  protected readonly happeningType = new FormControl<HappeningType>(
    'recurring',
    Validators.required,
  );

  protected readonly happeningForm = new FormGroup({
    title: this.happeningTitle,
  });

  private readonly hasNavHistory: boolean;

  protected isToDo = false;

  private readonly onHappeningTitleChanged = (): void => {
  };

  constructor() {
    super();
    const routingState = inject(RoutingState);
    this.happeningTitle.registerOnChange(this.onHappeningTitleChanged);
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

  ngAfterViewInit(): void /* Intentionally not ngOnInit*/ {
    // console.log('HappeningFormComponent.ngAfterViewInit()');
    this.setFocusToInput(this.titleInput);
  }

  protected onHappeningTypeChanged(event: Event): void {
    const happeningType = (event as CustomEvent).detail.value as HappeningType;
    let happening = this.$happening();
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
    this.changeDetectorRef.markForCheck();
  }

  protected onTitleChanged(event: CustomEvent): void {

    if (event.detail.value === this.titleInput?.value) {
      this.happeningTitle.reset();
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
    this.happeningForm.markAllAsTouched();
  }

  protected onHappeningChanged(happening: IHappeningContext): void {
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
            if (this.hasNavHistory) {
              this.navController
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
