import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ISlotItem } from '../../view-models';
import { IScheduleFilter } from '../schedule-filter/schedule-filter';
import { isSlotVisible } from '../schedule-slots';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-schedule-day',
	templateUrl: './schedule-day.component.html',
})
export class ScheduleDayComponent implements OnChanges, OnDestroy {
	private readonly destroyed = new Subject<void>();
	private slotsSubscription?: Subscription;
	@Input() team?: ITeamContext;
	@Input() filter?: IScheduleFilter;
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Input() weekday?: Weekday;
	@Output() readonly slotClicked = new EventEmitter<ISlotItem>();
	@Output() readonly resetFilter = new EventEmitter<Event>();
	public slots?: ISlotItem[];
	public slotsHiddenByFilter?: number;

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
								slot => isSlotVisible(slot, this.filter || { text: '' },
									this.showRegulars, this.showEvents));
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
