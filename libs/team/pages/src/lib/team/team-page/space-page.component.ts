import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatCardListComponent } from '@sneat/components';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusServicesModule,
	ContactusSpaceContextService,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { MembersListComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo, TopMenuService } from '@sneat/core';
import {
	InviteLinksComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
import { MembersComponent } from '../members/members.component';
import { SpacePageBaseComponent } from './SpacePageBaseComponent';

@Component({
	selector: 'sneat-space-page',
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
		SpaceServiceModule,
	],
})
export class SpacePageComponent extends SpacePageBaseComponent {
	protected contactusSpace?: IIdAndOptionalDbo<IContactusSpaceDbo>;

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		topMenuService: TopMenuService,
		cd: ChangeDetectorRef, // readonly navService: TeamNavService,
		contactusTeamService: ContactusSpaceService,
	) {
		super('TeamPageComponent', route, params, topMenuService, cd);
		const contactusTeamContextService = new ContactusSpaceContextService(
			params.errorLogger,
			this.destroyed$,
			this.spaceIDChanged$,
			contactusTeamService,
		);
		contactusTeamContextService.contactusSpaceContext$
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: (contactusTeam) => {
					this.contactusSpace = contactusTeam;
					this.onContactusSpaceChanged(contactusTeam);
				},
			});
	}

	protected goMembers(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.spaceParams.spaceNavService
			.navigateForwardToSpacePage(this.space, 'members', {
				state: {
					contactusSpace: this.contactusSpace,
				},
			})
			.catch(console.error);
	}
}
