import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';
import { ITeamContext } from '@sneat/team/models';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { emptyScheduleFilter, ScheduleFilterService } from '../schedule-filter.service';
import { isSlotVisible } from '../schedule-slots';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-schedule-day',
	templateUrl: './schedule-day.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDayComponent implements OnChanges, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private slotsSubscription?: Subscription;
	private filter = emptyScheduleFilter;
	// @Input() filter?: IScheduleFilter;
	// @Input() showRegulars = true;
	@Input() team?: ITeamContext;
	// @Input() showEvents = true;
	@Input() weekday?: Weekday;
	@Output() readonly slotClicked = new EventEmitter<ISlotItem>();
	public allSlots?: ISlotItem[];
	public slots?: ISlotItem[];
	public slotsHiddenByFilter?: number;

	constructor(
		private readonly filterService: ScheduleFilterService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		filterService.filter.subscribe({
			next: filter => {
				this.filter = filter;
				this.applyFilter();
			},
		});
	}

	resetFilter(event: Event): void {
		event.stopPropagation();
		this.filterService.resetScheduleFilter();
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ScheduleDayComponent.ngOnChanges()', changes);
		if (changes['weekday']) {
			this.subscribeForSlots();
		}
	}

	readonly index = (i: number): number => i;

	private applyFilter(): void {
		if (this.allSlots?.length) {
			this.slots = this.allSlots.filter(slot => isSlotVisible(slot, this.filter));
			this.slotsHiddenByFilter = this.allSlots.length - this.slots.length;
			console.log('ScheduleDayComponent.applyFilter() =>',
				'slotsHiddenByFilter:', this.slotsHiddenByFilter,
				'filter:', this.filter,
				'slots before filter:', this.allSlots,
				'slots after filter:', this.slots,
				);
		} else {
			console.log('ScheduleDayComponent.applyFilter() for empty slots');
			this.slots = this.allSlots;
			this.slotsHiddenByFilter = this.allSlots?.length;
		}
		this.changeDetectorRef.markForCheck();
	}

	private subscribeForSlots(): void {
		if (this.weekday?.day) {
			this.slotsSubscription?.unsubscribe();
			this.slotsSubscription = this.weekday.day.slots$
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: slots => {
						this.allSlots = slots;
						this.applyFilter();
					},
				});
		} else {
			this.slots = undefined;
			this.slotsHiddenByFilter = undefined;
		}
	}

}
