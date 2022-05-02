import { AfterViewInit, Component, Input } from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { ITeamContext } from '@sneat/team/models';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem } from '../../view-models';
import { getToday, ScheduleStateService } from '../schedule-state.service';
import { SwipeableBaseComponent } from '../swipeable-base.component';
import { SwipeableDay, swipeableDay } from '../swipeable-ui';
import { ScheduleDayBaseComponent } from './schedule-day-base.component';

// This is 1 of the 2 "day cards" used at ScheduleDayTabComponent
// The 1st is the "active day" (e.g. today), and the 2nd is "next day" (e.g. tomorrow).
// The 2nd should set the [activeDayPlus]="1"
@Component({
	selector: 'sneat-swipeable-day-card',
	templateUrl: 'schedule-day-card.component.html',
	animations: virtualSliderAnimations,
})
export class ScheduleDayCardComponent extends ScheduleDayBaseComponent implements AfterViewInit {

	@Input() team?: ITeamContext;
	@Input() activeDayPlus = 0;
	@Input() teamDaysProvider?: TeamDaysProvider;

	constructor(
		scheduleSateService: ScheduleStateService,
		// private readonly teamDaysProvider: TeamDaysProvider,
	) {
		super(scheduleSateService);
	}

	@Input() onSlotClicked?: (slot: ISlotItem) => void = () => {
		throw new Error('onSlotClicked not set');
	};

	ngAfterViewInit(): void {
		if (this.activeDayPlus < 0) {
			throw new Error('todayPlus < 0');
		}
		this.createSlides();
	}

	private createSlides(): void {
		if (!this.teamDaysProvider) {
			return;
			throw new Error('!this.teamDaysProvider');
		}
		const current = getToday();
		if (this.activeDayPlus) {
			current.setDate(current.getDate() + this.activeDayPlus);
		}
		const next = new Date();
		next.setDate(current.getDate() + 1);
		const destroyed = this.destroyed.asObservable();
		this.oddSlide = swipeableDay('odd', current, this.teamDaysProvider, destroyed);
		this.evenSlide = swipeableDay('even', next, this.teamDaysProvider, destroyed);
	}
}
