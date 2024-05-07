import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
} from '@angular/core';
import { HappeningType } from '@sneat/mod-schedulus-core';
import {
	IHappeningSlotUiItem,
	NewHappeningParams,
	ScheduleNavService,
	TeamDay,
} from '@sneat/extensions/schedulus/shared';
import { ITeamContext } from '@sneat/team-models';
import { takeUntil } from 'rxjs';
import {
	emptyScheduleFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../schedule-slots';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-weekday',
	templateUrl: './calendar-weekday.component.html',
})
export class CalendarWeekdayComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	private filter = emptyScheduleFilter;
	@Input() team: ITeamContext = { id: '' };
	@Input() weekday?: Weekday;
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<{
		slot: IHappeningSlotUiItem;
		event: Event;
	}>();

	public get day(): TeamDay | undefined {
		return this.weekday?.day;
	}

	constructor(
		filterService: CalendarFilterService,
		private readonly scheduleNavService: ScheduleNavService,
	) {
		filterService.filter.pipe(takeUntil(this.destroyed)).subscribe({
			next: (filter) => {
				this.filter = filter;
			},
		});
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	// protected readonly id = (_: number, o: { id: string }) => o.id;

	onSlotClicked(args: { slot: IHappeningSlotUiItem; event: Event }): void {
		console.log('ScheduleWeekdayComponent.onSlotClicked', args);
		this.slotClicked.emit(args);
	}

	showSlot(slot: IHappeningSlotUiItem): boolean {
		return isSlotVisible(
			this.team?.id,
			slot,
			this.filter || emptyScheduleFilter,
		);
	}

	onDateSelected(): void {
		// console.log('onDateSelected', event);
		if (this.weekday?.day?.date) {
			this.dateSelected.next(this.weekday?.day?.date);
		}
	}

	goNewHappening(type: HappeningType): void {
		console.log('ScheduleWeekdayComponent.goNewHappening()', type);
		if (!this.team) {
			return;
		}
		const params: NewHappeningParams = {
			type,
			wd: this.weekday?.id,
			date: this.weekday?.day?.dateID,
		};
		this.scheduleNavService.goNewHappening(this.team, params);
	}
}
