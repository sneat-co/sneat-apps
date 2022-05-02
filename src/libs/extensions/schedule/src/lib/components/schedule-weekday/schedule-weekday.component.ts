import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { HappeningType } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { takeUntil } from 'rxjs';
import { ISlotItem, NewHappeningParams, TeamDay } from '../../view-models';
import { emptyScheduleFilter, ScheduleFilterService } from '../schedule-filter.service';
import { isSlotVisible } from '../schedule-slots';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-schedule-weekday',
	templateUrl: './schedule-weekday.component.html',
})
export class ScheduleWeekdayComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	private filter = emptyScheduleFilter;
	@Input() team?: ITeamContext;
	@Input() weekday?: Weekday;
	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<ISlotItem>();

	public get day(): TeamDay | undefined {
		return this.weekday?.day;
	}

	constructor(
		filterService: ScheduleFilterService,
	) {
		filterService.filter
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: filter => {
					this.filter = filter;
				},
			});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	// public readonly id = (_: number, v: {id: string}) => v.id;

	showSlot(slot: ISlotItem): boolean {
		return isSlotVisible(slot, this.filter || emptyScheduleFilter);
	}

	onDateSelected(): void {
		// console.log('onDateSelected', event);
		if (this.weekday?.day?.date) {
			this.dateSelected.next(this.weekday?.day?.date);
		}
	}

	goNewHappening(type: HappeningType): void {
		this.goNew.emit({ type, wd: this.weekday?.id, date: this.weekday?.day?.dateID });
	}

}
