import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { HappeningType } from '@sneat/dto';
import { ISlotItem, NewHappeningParams, ScheduleNavService, TeamDay } from '@sneat/extensions/schedulus/shared';
import { ITeamContext } from '@sneat/team/models';
import { takeUntil } from 'rxjs';
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
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<{slot: ISlotItem; event: Event}>();

	public get day(): TeamDay | undefined {
		return this.weekday?.day;
	}

	constructor(
		filterService: ScheduleFilterService,
		private readonly scheduleNavService: ScheduleNavService,
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

	onSlotClicked(args: {slot: ISlotItem; event: Event}): void {
		console.log('ScheduleWeekdayComponent.onSlotClicked', args);
		this.slotClicked.emit(args);
	}

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
		if (!this.team) {
			return;
		}
		const params: NewHappeningParams = { type, wd: this.weekday?.id, date: this.weekday?.day?.dateID };
		this.scheduleNavService.goNewHappening(this.team, params);
	}

}
