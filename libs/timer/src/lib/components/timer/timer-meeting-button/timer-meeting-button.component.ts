import { Component, Input } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { IScrumDbo } from '@sneat/ext-scrumspace-scrummodels';

@Component({
	selector: 'sneat-timer-meeting-button',
	templateUrl: './timer-meeting-button.component.html',
	imports: [IonButton],
})
export class TimerMeetingButtonComponent {
	@Input() public scrumID?: string;
	@Input() public scrum?: IScrumDbo;
	@Input() public spaceID?: string;
}
