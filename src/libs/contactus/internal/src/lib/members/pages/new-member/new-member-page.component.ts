import { CommonModule } from "@angular/common";
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { IonicModule, IonInput } from "@ionic/angular";
import { ContactComponentBaseParams } from "@sneat/contactus-shared";
import { emptyRelatedPerson, IRelatedPerson } from '@sneat/dto';
import { TeamBaseComponent, TeamComponentBaseParams, TeamComponentsModule } from "@sneat/team/components";
import { filter, first, takeUntil } from 'rxjs';
import { NewMemberFormComponent } from "./new-member-form.component";


@Component({
	selector: 'sneat-new-member-page',
	templateUrl: './new-member-page.component.html',
	providers: [
		TeamComponentBaseParams,
		ContactComponentBaseParams,
	],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		NewMemberFormComponent,
		TeamComponentsModule,
	],
})
export class NewMemberPageComponent extends TeamBaseComponent {

	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	public tab: 'personal' | 'mass' = 'mass';

	relatedPerson: IRelatedPerson = emptyRelatedPerson;

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
	) {
		super('NewMemberPageComponent', route, params);
		this.trackFirstTeamTypeChanged();
		route.queryParams.subscribe(params => {
			const ageGroup = params['ageGroup'];
			console.log('ageGroup', ageGroup);
			if (ageGroup) {
				this.relatedPerson = { ...this.relatedPerson, ageGroup: ageGroup };
			}
			const roles = params['roles'] || '';
			if (roles) {
				this.relatedPerson = { ...this.relatedPerson, roles: roles.split(',') };
			}
		});

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
