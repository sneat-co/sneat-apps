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
	ISlotUIEvent,
	NewHappeningParams,
	ScheduleNavService,
	SpaceDay,
} from '@sneat/extensions/schedulus/shared';
import { ISpaceContext } from '@sneat/team-models';
import { takeUntil } from 'rxjs';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../../../calendar-filter.service';
import { isSlotVisible } from '../../../schedule-slots';
import { Weekday } from '../../weekday';

@Component({
	selector: 'sneat-calendar-weekday',
	templateUrl: './calendar-weekday.component.html',
	standalone: false,
})
export class CalendarWeekdayComponent implements OnDestroy {
	private readonly destroyed = new EventEmitter<void>();
	private filter = emptyCalendarFilter;

	@Input({ required: true }) space?: ISpaceContext;
	@Input() weekday?: Weekday;

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
			!!this.space &&
			isSlotVisible(this.space?.id, slot, this.filter || emptyCalendarFilter)
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
		if (!this.space) {
			return;
		}
		const params: NewHappeningParams = {
			type,
			wd: this.weekday?.id,
			date: this.weekday?.day?.dateID,
		};
		this.scheduleNavService.goNewHappening(this.space, params);
	}
}
