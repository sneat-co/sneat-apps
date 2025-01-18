import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
} from '@angular/core';
import { dateToIso } from '@sneat/core';
import {
	ISlotUIContext,
	jsDayToWeekday,
	NewHappeningParams,
	ScheduleNavService,
	sortSlotItems,
	WeekdayNumber,
} from '@sneat/mod-schedulus-core';
import { ISpaceContext } from '@sneat/team-models';
import { Subject, Subscription, takeUntil } from 'rxjs';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../schedule-slots';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-day',
	templateUrl: './calendar-day.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false,
})
export class CalendarDayComponent implements OnChanges, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private slotsSubscription?: Subscription;
	private filter = emptyCalendarFilter;
	// @Input() filter?: ICalendarFilter;
	// @Input() showRegulars = true;
	// @Input() showEvents = true;

	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) weekday?: Weekday;

	public allSlots?: ISlotUIContext[];
	public slots?: ISlotUIContext[];
	public slotsHiddenByFilter?: number;

	constructor(
		private readonly filterService: CalendarFilterService,
		private readonly changeDetectorRef: ChangeDetectorRef,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		filterService.filter.pipe(takeUntil(this.destroyed)).subscribe({
			next: (filter) => {
				this.filter = filter;
				this.applyFilter();
			},
		});
	}

	protected resetFilter(event: Event): void {
		event.stopPropagation();
		this.filterService.resetScheduleFilter();
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		const weekdayChange = changes['weekday'];
		if (weekdayChange) {
			if (weekdayChange.firstChange && !weekdayChange.currentValue) {
				return; // TODO: comment with explanation why we need this
			}
			this.subscribeForSlots();
		}
	}

	private applyFilter(): void {
		const spaceID = this.space?.id;
		if (spaceID && this.allSlots?.length) {
			this.slots = this.allSlots
				.filter((slot) => isSlotVisible(slot, this.filter))
				.sort(sortSlotItems);
			this.slotsHiddenByFilter = this.allSlots.length - this.slots.length;
			console.log(
				this.logPrefix() + '.applyFilter() =>',
				'slotsHiddenByFilter:',
				this.slotsHiddenByFilter,
				'filter:',
				this.filter,
				'slots before filter:',
				this.allSlots,
				'slots after filter:',
				this.slots,
			);
		} else {
			// console.log(this.logPrefix() + '.applyFilter() for empty slots');
			this.slots = this.allSlots;
			this.slotsHiddenByFilter = this.allSlots?.length;
		}
		this.changeDetectorRef.markForCheck();
	}

	private subscribeForSlots(): void {
		this.slotsSubscription?.unsubscribe();
		if (this.weekday?.day) {
			console.log(
				`ScheduleDayComponent[wd=${this.weekday?.id}, dateID=${this.weekday?.day?.dateID}].subscribeForSlots()`,
			);
			this.slotsSubscription = this.weekday.day.slots$
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: this.processSlots,
				});
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

	private readonly logPrefix = (dateID?: string) =>
		`ScheduleDayComponent[dateID=${this.weekday?.day?.dateID || dateID}]`;

	protected goNewHappening(params: NewHappeningParams): void {
		if (!this.space) {
			return;
		}
		const date = this.weekday?.day?.date;
		if (!date) {
			return;
		}
		params = {
			...params,
			wd: jsDayToWeekday(date.getDay() as WeekdayNumber),
			date: dateToIso(date),
		};
		console.log('ScheduleDayComponent.goNewHappening()', date, params);
		this.scheduleNavService.goNewHappening(this.space, params);
	}
}
