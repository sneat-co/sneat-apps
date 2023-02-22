import { Component, Input } from '@angular/core';
import { IRecord, IRetrospective, ITeam } from '../../../../../models/interfaces';

@Component({
	selector: 'sneat-retro-review-stage',
	templateUrl: './retro-review-stage.component.html',
	styleUrls: ['./retro-review-stage.component.scss'],
})
export class RetroReviewStageComponent {
	@Input() team: IRecord<ITeam>;
	@Input() retrospective: IRecord<IRetrospective>;
}
