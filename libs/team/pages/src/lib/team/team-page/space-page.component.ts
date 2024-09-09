import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatAuthStateService } from '@sneat/auth-core';
import { SneatCardListComponent } from '@sneat/components';
import {
	IContactusSpaceDbo,
	IContactusSpaceDboAndID,
} from '@sneat/contactus-core';
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
import { zipMapBriefsWithIDs } from '@sneat/team-models';
import { SpaceServiceModule } from '@sneat/team-services';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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

	private readonly contactusSpaceContextService: ContactusSpaceContextService;

	constructor(
		route: ActivatedRoute,
		params: SpaceComponentBaseParams,
		topMenuService: TopMenuService,
		cd: ChangeDetectorRef, // readonly navService: TeamNavService,
		contactusTeamService: ContactusSpaceService,
	) {
		super('SpacePageComponent', route, params, topMenuService, cd);
		this.contactusSpaceContextService = new ContactusSpaceContextService(
			params.errorLogger,
			this.destroyed$,
			this.spaceIDChanged$,
			contactusTeamService,
			this.userService,
		);
		this.userService.userChanged.pipe(this.takeUntilNeeded()).subscribe({
			next: (uid) => {
				if (uid) {
					this.subscribeForContactusSpaceChanges();
				} else {
					this.contactusSpaceSub?.unsubscribe();
				}
			},
		});
	}

	private contactusSpaceSub?: Subscription;

	private subscribeForContactusSpaceChanges(): void {
		this.contactusSpaceSub?.unsubscribe();
		this.contactusSpaceSub =
			this.contactusSpaceContextService.contactusSpaceContext$
				.pipe(this.takeUntilNeeded(), takeUntil(this.userService.userChanged))
				.subscribe({
					next: (contactusTeam) => {
						this.contactusSpace = contactusTeam;
						this.onContactusSpaceChanged(contactusTeam);
					},
				});
	}

	protected onContactusSpaceChanged(contactusTeam?: IContactusSpaceDboAndID) {
		console.log('TeamPage.onContactusSpaceChanged()', contactusTeam);
		// super.onContactusTeamChanged(contactusTeam);
		this.members = zipMapBriefsWithIDs(contactusTeam?.dbo?.contacts)
			.filter((c) => c.brief?.roles?.includes('member'))
			.map((c) => ({ ...c, space: this.space }));
		console.log(
			'TeamPage.onContactusTeamChanged() => this.members',
			this.members,
		);
		this.cd.markForCheck();
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
