import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatCardListComponent } from '@sneat/components';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusServicesModule,
	ContactusTeamContextService,
	ContactusTeamService,
} from '@sneat/contactus-services';
import { MembersListComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo, TopMenuService } from '@sneat/core';
import {
	InviteLinksComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { TeamServiceModule } from '@sneat/team-services';
import { MembersComponent } from '../members/members.component';
import { SpacePageBaseComponent } from './SpacePageBaseComponent';

@Component({
	selector: 'sneat-team-page',
	templateUrl: './space-page.component.html',
	providers: [SpaceComponentBaseParams],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule,
		InviteLinksComponent,
		SneatCardListComponent,
		MembersListComponent,
		ContactusServicesModule,
		MembersComponent,
		TeamServiceModule,
	],
})
export class SpacePageComponent extends SpacePageBaseComponent {
	protected contactusTeam?: IIdAndOptionalDbo<IContactusSpaceDbo>;

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		topMenuService: TopMenuService,
		cd: ChangeDetectorRef, // readonly navService: TeamNavService,
		contactusTeamService: ContactusTeamService,
	) {
		super('TeamPageComponent', route, params, topMenuService, cd);
		const contactusTeamContextService = new ContactusTeamContextService(
			params.errorLogger,
			this.destroyed$,
			this.teamIDChanged$,
			contactusTeamService,
		);
		contactusTeamContextService.contactusTeamContext$
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: (contactusTeam) => {
					this.contactusTeam = contactusTeam;
					this.onContactusTeamChanged(contactusTeam);
				},
			});
	}

	protected goMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.teamParams.teamNavService
			.navigateForwardToSpacePage(this.team, 'members', {
				state: {
					contactusTeam: this.contactusTeam,
				},
			})
			.catch(console.error);
	}
}
