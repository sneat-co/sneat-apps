import { CommonModule } from '@angular/common';
import {
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import {
	MemberRole,
	MemberRoleContributor,
	MemberRoleSpectator,
	IContactusSpaceDbo,
	IContactusSpaceDboAndID,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { zipMapBriefsWithIDs } from '@sneat/team-models';
import { TeamNavService, TeamService } from '@sneat/team-services';

@Component({
	selector: 'sneat-team-members',
	templateUrl: './members.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, IonicModule],
}) // TODO: use or delete unused MembersComponent
export class MembersComponent implements OnChanges {
	@Input({ required: true }) public contactusTeam?: IContactusSpaceDboAndID;

	public membersRoleTab: MemberRole | '*' = MemberRoleContributor;
	public contributorsCount?: number;
	public spectatorsCount?: number;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamService: TeamService,
		private readonly navController: NavController,
		public readonly navService: TeamNavService,
	) {}

	public goAddMember(event?: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (!this.contactusTeam) {
			throw 'no team';
		}
		this.navService.navigateToAddMember(this.navController, this.contactusTeam);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactusTeam']) {
			try {
				this.setMembersCount(this.contactusTeam?.dbo);
			} catch (e) {
				this.errorLogger.logError(e, 'Failed to process team changes');
			}
		}
	}

	public onSelfRemoved(): void {
		// this.unsubscribe('onSelfRemoved');
	}

	private setMembersCount(team?: IContactusSpaceDbo | null): void {
		if (team) {
			const count = (role: MemberRole): number =>
				zipMapBriefsWithIDs(team.contacts)?.filter((m) =>
					m.brief.roles?.includes(role),
				)?.length || 0;
			this.contributorsCount = count(MemberRoleContributor);
			this.spectatorsCount = count(MemberRoleSpectator);
		} else {
			this.contributorsCount = undefined;
			this.spectatorsCount = undefined;
		}
	}
}
