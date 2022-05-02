import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { NewHappeningParams } from '../../view-models';
import { ScheduleStateService } from '../schedule-state.service';
import { ScheduleDayBaseComponent } from './schedule-day-base.component';

@Component({
	selector: 'sneat-schedule-day-header',
	templateUrl: 'schedule-day-header.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
	animations: virtualSliderAnimations,
})
export class ScheduleDayHeaderComponent extends ScheduleDayBaseComponent {

	@Output() goNew = new EventEmitter<NewHappeningParams>();

	constructor(
		scheduleSateService: ScheduleStateService,
	) {
		super('ScheduleDayCardHeaderComponent', scheduleSateService);
	}



}
