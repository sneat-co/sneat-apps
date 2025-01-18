import {
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
} from '@angular/core';
import { HappeningType } from '@sneat/mod-schedulus-core';
import {
	ISlotUIContext,
	NewHappeningParams,
	ScheduleNavService,
} from '@sneat/mod-schedulus-core';
import { takeUntil } from 'rxjs';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../schedule-slots';
import { Weekday } from '../../weekday';
import { SpaceDay } from '../../../../services/space-day';

@Component({
	selector: 'sneat-calendar-weekday',
	templateUrl: './calendar-weekday.component.html',
	standalone: false,
})
export class CalendarWeekdayComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	private filter = emptyCalendarFilter;

	@Input({ required: true }) weekday?: Weekday;

	@Output() dateSelected = new EventEmitter<Date>();

	protected get day(): SpaceDay | undefined {
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

	protected showSlot(slot: ISlotUIContext): boolean {
		return (
			!!this.weekday?.day &&
			isSlotVisible(slot, this.filter || emptyCalendarFilter)
		);
	}

	protected onDateSelected(): void {
		// console.log('onDateSelected', event);
		if (this.weekday?.day?.date) {
			this.dateSelected.next(this.weekday?.day?.date);
		}
	}

	protected goNewHappening(type: HappeningType): void {
		console.log('ScheduleWeekdayComponent.goNewHappening()', type);
		const space = this.weekday?.day?.spaces?.length
			? this.weekday.day.spaces[0]
			: undefined;
		if (!space) {
			return;
		}
		const params: NewHappeningParams = {
			type,
			wd: this.weekday?.id,
			date: this.weekday?.day?.dateID,
		};
		this.scheduleNavService.goNewHappening(space, params);
	}
}
