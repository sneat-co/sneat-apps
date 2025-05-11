import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	input,
	Input,
	OnChanges,
	OnDestroy,
	signal,
	SimpleChanges,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { dateToIso } from '@sneat/core';
import {
	ISlotUIContext,
	jsDayToWeekday,
	NewHappeningParams,
	ScheduleNavService,
	ScheduleNavServiceModule,
	sortSlotItems,
	WeekdayNumber,
} from '@sneat/mod-schedulus-core';
import { WithSpaceInput } from '@sneat/space-components';
import { Subscription } from 'rxjs';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../calendar-slots';
import { Weekday } from '../../weekday';
import { isToday, isTomorrow } from '../../../calendar-core';
import { DaySlotItemComponent } from '../day-slot-item/day-slot-item.component';

@Component({
	imports: [
		ScheduleNavServiceModule,
		DaySlotItemComponent,
		IonItem,
		IonSpinner,
		IonLabel,
		IonItemDivider,
		IonButtons,
		IonIcon,
		IonButton,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-calendar-day',
	templateUrl: './calendar-day.component.html',
})
export class CalendarDayComponent
	extends WithSpaceInput
	implements OnChanges, OnDestroy
{
	private slotsSubscription?: Subscription;
	private filter = emptyCalendarFilter;
	// @Input() filter?: ICalendarFilter;
	// @Input() showRegulars = true;
	// @Input() showEvents = true;

	public readonly $weekday = input.required<Weekday | undefined>();

	@Input({ required: false }) hideAddButtons = false;
	@Input() hideLastBorder = false;

	protected readonly $isToday = signal<boolean>(false);
	protected readonly $isTomorrow = signal<boolean>(false);

	public allSlots?: ISlotUIContext[];
	public slots?: ISlotUIContext[];
	public slotsHiddenByFilter?: number;

	constructor(
		private readonly filterService: CalendarFilterService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		super('CalendarDayComponent');
		filterService.filter.pipe(this.takeUntilDestroyed()).subscribe({
			next: (filter) => {
				this.filter = filter;
				this.applyFilter();
			},
		});
	}

	protected readonly resetFilter = (event: Event) =>
		this.filterService.resetScheduleFilter(event);

	ngOnChanges(changes: SimpleChanges): void {
		const weekdayChange = changes['weekday'];
		if (weekdayChange) {
			const date = this.$weekday()?.day?.date;
			this.$isToday.set(!date || isToday(date));
			this.$isTomorrow.set(isTomorrow(date));
			// if (weekdayChange.firstChange && !weekdayChange.currentValue) {
			// 	return; // TODO: comment with explanation why we need this
			// }
			this.subscribeForSlots();
		}
	}

	private applyFilter(): void {
		if (this.allSlots?.length) {
			this.slots = this.allSlots
				.filter((slot) => isSlotVisible(slot, this.filter))
				.sort(sortSlotItems);
			this.slotsHiddenByFilter = this.allSlots.length - this.slots.length;
			// console.log(
			// 	this.logPrefix() + '.applyFilter() =>',
			// 	'slotsHiddenByFilter:',
			// 	this.slotsHiddenByFilter,
			// 	'filter:',
			// 	this.filter,
			// 	'slots before filter:',
			// 	this.allSlots,
			// 	'slots after filter:',
			// 	this.slots,
			// );
		} else {
			// console.log(this.logPrefix() + '.applyFilter() for empty slots');
			this.slots = this.allSlots;
			this.slotsHiddenByFilter = 0;
		}
		this.changeDetectorRef.markForCheck();
	}

	private subscribeForSlots(): void {
		this.slotsSubscription?.unsubscribe();
		const weekday = this.$weekday();
		if (weekday?.day) {
			console.log(
				`ScheduleDayComponent[wd=${weekday.id}, dateID=${weekday.day?.dateID}].subscribeForSlots()`,
			);
			this.slotsSubscription = weekday.day.slots$
				.pipe(this.takeUntilDestroyed())
				.subscribe(this.processSlots);
		} else {
			this.slots = undefined;
			this.slotsHiddenByFilter = undefined;
		}
	}

	private readonly processSlots = (slots?: ISlotUIContext[]) => {
		console.log(this.logPrefix() + `.processSlots(), slots:`, slots);
		this.allSlots = slots;
		this.applyFilter();
	};

	private readonly logPrefix = () =>
		`CalendarDayComponent{dateID=${this.$weekday()?.day?.dateID}}`;

	protected goNewHappening(params: NewHappeningParams): void {
		const space = this.$space();
		if (!space) {
			return;
		}
		const date = this.$weekday()?.day?.date;
		if (!date) {
			return;
		}
		params = {
			...params,
			wd: jsDayToWeekday(date.getDay() as WeekdayNumber),
			date: dateToIso(date),
		};
		console.log('ScheduleDayComponent.goNewHappening()', date, params);
		this.scheduleNavService.goNewHappening(space, params);
	}
}
