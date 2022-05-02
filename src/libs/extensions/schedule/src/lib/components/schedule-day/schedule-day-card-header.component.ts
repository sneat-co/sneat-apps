import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { NewHappeningParams } from '../../view-models';
import { ScheduleStateService } from '../schedule-state.service';
import { ScheduleDayBaseComponent } from './schedule-day-base.component';

@Component({
	selector: 'sneat-schedule-day-card-header',
	templateUrl: 'schedule-day-card-header.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: virtualSliderAnimations,
})
export class ScheduleDayCardHeaderComponent extends ScheduleDayBaseComponent {

	@Output() goNew = new EventEmitter<NewHappeningParams>();

	constructor(
		scheduleSateService: ScheduleStateService,
	) {
		super(scheduleSateService);
	}

	setToday(): void {
		this.scheduleSateService.setToday();
	}

	goNewHappening(params: NewHappeningParams): void {
		this.goNew.emit(params);
	}

}
