import { Component, Input, OnInit } from '@angular/core';
import { IScrum } from '@sneat/scrumspace/scrummodels';

@Component({
	selector: 'sneat-timer-meeting-button',
	templateUrl: './timer-meeting-button.component.html',
	styleUrls: ['./timer-meeting-button.component.scss'],
})
export class TimerMeetingButtonComponent implements OnInit {
	@Input() public scrumId: string;
	@Input() public scrum?: IScrum;
	@Input() public teamId: string;

	constructor() {}

	ngOnInit() {}
}
