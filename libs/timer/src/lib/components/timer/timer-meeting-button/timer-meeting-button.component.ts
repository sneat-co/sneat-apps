import { Component, Input } from '@angular/core';
import { IScrumDto } from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-timer-meeting-button',
	templateUrl: './timer-meeting-button.component.html',
})
export class TimerMeetingButtonComponent {
	@Input() public scrumId?: string;
	@Input() public scrum?: IScrumDto;
	@Input() public teamId?: string;
}
