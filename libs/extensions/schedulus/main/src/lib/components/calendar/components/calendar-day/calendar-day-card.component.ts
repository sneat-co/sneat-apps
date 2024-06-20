import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	Output,
} from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { HappeningType } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { TeamDaysProvider } from '../../../../services/team-days-provider';
import { ScheduleNavService } from '@sneat/extensions/schedulus/shared';
import {
	ISlotUIContext,
	NewHappeningParams,
} from '@sneat/extensions/schedulus/shared';
import { getToday, CalendarStateService } from '../../calendar-state.service';
import { swipeableDay } from '../../../swipeable-ui';
import { CalendarDayBaseComponent } from './calendar-day-base.component';

// This is 1 of the 2 "day cards" used at ScheduleDayTabComponent
// The 1st is the "active day" (e.g. today), and the 2nd is "next day" (e.g. tomorrow).
// The 2nd should set the [activeDayPlus]="1"
@Component({
	selector: 'sneat-calendar-day-card',
	templateUrl: 'calendar-day-card.component.html',
	animations: virtualSliderAnimations,
})
export class CalendarDayCardComponent
	extends CalendarDayBaseComponent
	implements AfterViewInit
{
	@Input() team: ITeamContext = { id: '' };
	@Input() teamDaysProvider?: TeamDaysProvider;
	@Output() goNew = new EventEmitter<NewHappeningParams>();

	@Input() set activeDayPlus(value: number) {
		this.shiftDays = value;
		console.log('set activeDayPlus()', value, 'shiftDays=', this.shiftDays);
	}

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		scheduleSateService: CalendarStateService,
		private readonly scheduleNavService: ScheduleNavService, // private readonly teamDaysProvider: TeamDaysProvider,
	) {
		super('ScheduleDayCardComponent', errorLogger, scheduleSateService);
	}

	@Input() onSlotClicked?: (args: {
		slot: ISlotUIContext;
		event: Event;
	}) => void = () => {
		throw new Error('onSlotClicked not set');
	};

	ngAfterViewInit(): void {
		console.log('ngAfterViewInit(), shiftDays=', this.shiftDays);
		if (this.shiftDays < 0) {
			throw new Error('shiftDays < 0');
		}
		this.createSlides();
	}

	protected newHappeningUrl(type: HappeningType): string {
		// TODO: Should use some shared func to get URL
		return `space/${this.team?.type}/${this.team?.id}/new-happening?type=${type}&wd=${this.activeDay?.weekday?.id}&date=${this.activeDay?.activeDateID}`;
	}

	protected goNewHappening(type: HappeningType): boolean {
		if (!this.team) {
			return false;
		}
		const params: NewHappeningParams = {
			type,
			wd: this.activeDay?.weekday?.id,
			date: this.activeDay?.activeDateID,
		};
		this.scheduleNavService.goNewHappening(this.team, params);
		return false;
	}

	private createSlides(): void {
		if (!this.teamDaysProvider) {
			throw new Error('!this.teamDaysProvider');
		}
		const current = getToday();
		if (this.activeDayPlus) {
			current.setDate(current.getDate() + this.activeDayPlus);
		}
		this.date = current;
		const next = new Date();
		next.setDate(this.date.getDate() + 1);
		this.oddSlide = swipeableDay(
			'odd',
			current,
			this.teamDaysProvider,
			this.destroyed$,
		);
		this.evenSlide = swipeableDay(
			'even',
			next,
			this.teamDaysProvider,
			this.destroyed$,
		);
		this.onDateChanged({ date: current, shiftDirection: '' });
	}
}
