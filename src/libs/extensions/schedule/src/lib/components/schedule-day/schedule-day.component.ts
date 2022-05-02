import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ISlotItem } from '../../view-models';
import { emptyScheduleFilter, ScheduleFilterService } from '../schedule-filter.service';
import { isSlotVisible } from '../schedule-slots';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-schedule-day',
	templateUrl: './schedule-day.component.html',
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
	public slots?: ISlotItem[];
	public slotsHiddenByFilter?: number;

	constructor(
		private filterService: ScheduleFilterService,
	) {
		filterService.filter.subscribe({
			next: filter => {
				this.filter = filter;
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
		if (changes['weekday'] || changes['filter']) {
			this.applyFilter();
		}
	}

	readonly index = (i: number): number => i;

	private applyFilter(): void {
		console.log('ScheduleDayComponent.applyFilter()');
		if (this.weekday?.day) {
			this.slotsSubscription?.unsubscribe();
			this.slotsSubscription = this.weekday.day.slots$
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: slots => {
						if (slots) {
							this.slots = slots.filter(
								slot => isSlotVisible(slot, this.filter));
							this.slotsHiddenByFilter = slots.length - this.slots.length;
							console.log('ScheduleDayComponent.applyFilter() => slotsHiddenByFilter:', this.slotsHiddenByFilter, this.slots, slots);
						} else {
							this.slots = undefined;
							this.slotsHiddenByFilter = undefined;
						}
					},
				});
		} else {
			this.slots = undefined;
			this.slotsHiddenByFilter = undefined;
		}
	}
}
