import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatCardListComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { MembersListComponent } from '@sneat/contactus-shared';
import { TopMenuService } from '@sneat/core';
import {
	InviteLinksComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import { MembersComponent } from '../members/members.component';
import { TeamPageBaseComponent } from './TeamPageBaseComponent';

@Component({
	selector: 'sneat-team-page',
	templateUrl: './team-page.component.html',
	providers: [TeamComponentBaseParams],
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
	],
})
export class TeamPageComponent extends TeamPageBaseComponent {
	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		topMenuService: TopMenuService,
		cd: ChangeDetectorRef, // readonly navService: TeamNavService,
	) {
		super('TeamPageComponent', route, params, topMenuService, cd);
	}
}
