import { Component, Input } from '@angular/core';
import { IScrumDbo } from '@sneat/scrumspace-scrummodels';

@Component({
	selector: 'sneat-timer-meeting-button',
	templateUrl: './timer-meeting-button.component.html',
	standalone: false,
})
export class TimerMeetingButtonComponent {
	@Input() public scrumID?: string;
	@Input() public scrum?: IScrumDbo;
	@Input() public spaceID?: string;
}
