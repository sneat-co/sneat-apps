import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { first } from 'rxjs';


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
		this.teamTypeChanged$
			.pipe(
				first(),
			)
			.subscribe({
				next: teamType => {
					if (teamType === 'family' && this.tab === 'mass') {
						this.tab = 'personal';
					}
				},
			});
	}

}
