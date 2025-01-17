import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
	ContactusServicesModule,
	ContactusSpaceContextService,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { MembersShortListCardComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo, TopMenuService } from '@sneat/core';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
import { SpacePageBaseComponent } from './SpacePageBaseComponent';

@Component({
	selector: 'sneat-space-page',
	templateUrl: './space-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule,
		ContactusServicesModule,
		SpaceServiceModule,
		MembersShortListCardComponent,
		// CalendarBriefComponent,
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
		super('SpacePageComponent', route, params, topMenuService, cd);
		new ContactusSpaceContextService(
			params.errorLogger,
			this.destroyed$,
			this.spaceIDChanged$,
			contactusTeamService,
			this.userService,
		).contactusSpaceContext$.subscribe(
			(contactusSpace) => (this.contactusSpace = contactusSpace),
		);
		// this.userService.userChanged.pipe(this.takeUntilNeeded()).subscribe({
		// 	next: (uid) => {
		// 		if (uid) {
		// 			this.subscribeForContactusSpaceChanges();
		// 		} else {
		// 			this.contactusSpaceSub?.unsubscribe();
		// 		}
		// 	},
		// });
	}
}
