import { Component, Input } from '@angular/core';
import { IScrumDbo } from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-timer-meeting-button',
	templateUrl: './timer-meeting-button.component.html',
})
export class TimerMeetingButtonComponent {
	@Input() public scrumId?: string;
	@Input() public scrum?: IScrumDbo;
	@Input() public teamId?: string;
}
