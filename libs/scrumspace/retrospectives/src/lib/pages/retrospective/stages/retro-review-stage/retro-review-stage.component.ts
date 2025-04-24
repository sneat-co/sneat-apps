import { Component, Input } from '@angular/core';
import { IRecord } from '@sneat/data';
import { IRetrospective } from '@sneat/ext-scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-retro-review-stage',
	templateUrl: './retro-review-stage.component.html',
})
export class RetroReviewStageComponent {
	@Input({ required: true }) space: ISpaceContext = { id: '' };
	@Input({ required: true }) retrospective?: IRecord<IRetrospective>;
}
