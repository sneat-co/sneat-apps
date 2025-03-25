import { Component, Input } from '@angular/core';
import { IRecord } from '@sneat/data';
import { IRetrospective } from '@sneat/scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-retro-feedback-stage',
	templateUrl: './retro-feedback-stage.component.html',
	standalone: false,
})
export class RetroFeedbackStageComponent {
	@Input({ required: true }) space: ISpaceContext = { id: '' };
	@Input({ required: true }) retrospective?: IRecord<IRetrospective>;

	public iAmReady?: boolean;

	public setReady(value: boolean) {
		this.iAmReady = value;
	}
}
