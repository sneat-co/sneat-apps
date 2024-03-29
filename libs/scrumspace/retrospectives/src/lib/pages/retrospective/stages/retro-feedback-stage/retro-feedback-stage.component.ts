import { Component, Input } from '@angular/core';
import {
	IRecord,
	IRetrospective,
	ITeam,
} from '../../../../../models/interfaces';

@Component({
	selector: 'sneat-retro-feedback-stage',
	templateUrl: './retro-feedback-stage.component.html',
})
export class RetroFeedbackStageComponent {
	@Input() team: IRecord<ITeam>;
	@Input() retrospective: IRecord<IRetrospective>;

	public iAmReady: boolean;

	public setReady(value: boolean) {
		this.iAmReady = value;
	}
}
