import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, IonInput } from '@ionic/angular';
import {
	ContactusServicesModule,
	ContactusSpaceContextService,
} from '@sneat/contactus-services';
import { ContactComponentBaseParams } from '@sneat/contactus-shared';
import {
	emptyMemberPerson,
	IContactusSpaceDboAndID,
	IMemberPerson,
} from '@sneat/contactus-core';
import {
	SpacePageBaseComponent,
	SpaceComponentBaseParams,
	InviteLinksComponent,
} from '@sneat/team-components';
import { filter, first, takeUntil } from 'rxjs';
import { NewMemberFormComponent } from './new-member-form.component';

@Component({
	selector: 'sneat-new-member-page',
	templateUrl: './new-member-page.component.html',
	providers: [SpaceComponentBaseParams, ContactComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ContactusServicesModule,
		NewMemberFormComponent,
		InviteLinksComponent,
	],
})
export class NewMemberPageComponent extends SpacePageBaseComponent {
	@ViewChild('nameInput', { static: false }) nameInput?: IonInput;

	public tab: 'personal' | 'mass' = 'mass';

	member: IMemberPerson = emptyMemberPerson;

	public override get defaultBackUrl(): string {
		const t = this.space;
		const url = t ? `/space/${t.type}/${t.id}/members` : '';
		return url && this.defaultBackPage ? url + '/' + this.defaultBackPage : url;
	}

	constructor(route: ActivatedRoute, params: ContactComponentBaseParams) {
		super('NewMemberPageComponent', route, params.spaceParams);
		const contactusTeamContextService = new ContactusSpaceContextService(
			params.errorLogger,
			this.destroyed$,
			this.spaceIDChanged$,
			params.contactusSpaceService,
		);
		this.trackFirstSpaceTypeChanged();
		route.queryParams.subscribe((params) => {
			const group = params['group'];
			console.log('group', group);
			switch (group) {
				case 'adults':
					this.member = { ...this.member, type: 'person', ageGroup: 'adult' };
					break;
				case 'kids':
					this.member = { ...this.member, type: 'person', ageGroup: 'child' };
					break;
				case 'pets':
					this.member = { ...this.member, type: 'animal' };
					break;
				default:
					this.member = { ...this.member, type: 'person' };
					break;
			}
			const roles = params['roles'] || '';
			if (roles) {
				this.member = { ...this.member, roles: roles.split(',') };
			}
		});

		contactusTeamContextService.contactusSpaceContext$
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: (contactusTeam) => {
					this.contactusSpace = contactusTeam;
				},
			});
	}

	protected contactusSpace?: IContactusSpaceDboAndID;

	private readonly trackFirstSpaceTypeChanged = (): void => {
		console.log('NewMemberPageComponent.trackFirstSpaceTypeChanged()');
		try {
			this.spaceTypeChanged$
				.pipe(
					takeUntil(this.destroyed$),
					filter((v) => !!v),
					first(),
				)
				.subscribe({
					next: (teamType) => {
						console.log(
							'NewMemberPageComponent: teamTypeChanged$ =>',
							teamType,
						);
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
