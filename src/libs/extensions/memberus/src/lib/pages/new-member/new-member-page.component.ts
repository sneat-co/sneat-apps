import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { filter, first, takeUntil } from 'rxjs';


@Component({
	selector: 'sneat-new-member-page',
	templateUrl: './new-member-page.component.html',
	providers: [TeamComponentBaseParams],
})
export class NewMemberPageComponent extends TeamBaseComponent {

	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	public tab: 'personal' | 'mass' = 'mass';

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
	) {
		super('NewMemberPageComponent', route, params);
		this.trackFirstTeamTypeChanged();
	}

	private readonly trackFirstTeamTypeChanged = (): void => {
		console.log('NewMemberPageComponent.trackFirstTeamTypeChanged()');
		try {
			this.teamTypeChanged$
				.pipe(
					takeUntil(this.destroyed),
					filter(v => !!v),
					first(),
				)
				.subscribe({
					next: teamType => {
						console.log('NewMemberPageComponent: teamTypeChanged$ =>', teamType);
						if (teamType === 'family' && this.tab === 'mass') {
							this.tab = 'personal';
						}
					},
					error: this.logErrorHandler('failed to process team type changes'),
				});
		} catch (e) {
			this.logError(e, 'failed to subscribe for first team type change');
		}
	};
}
