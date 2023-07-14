import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IRecord } from '@sneat/data';
import { ITeamDto, MemberRole, MemberRoleContributor, MemberRoleSpectator } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamNavService, TeamService } from '@sneat/team/services';

@Component({
	selector: 'sneat-team-members',
	templateUrl: './members.component.html',
})
export class MembersComponent implements OnChanges {
	@Input() public team?: IRecord<ITeamDto>;

	public membersRoleTab: MemberRole | '*' = MemberRoleContributor;
	public contributorsCount?: number;
	public spectatorsCount?: number;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly teamService: TeamService,
		private readonly navController: NavController,
		public readonly navService: TeamNavService,
	) {
	}

	public goAddMember(event?: Event): void {
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		if (!this.team) {
			throw 'no team';
		}
		this.navService.navigateToAddMember(this.navController, this.team);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			try {
				this.setMembersCount(this.team?.dto);
			} catch (e) {
				this.errorLogger.logError(e, 'Failed to process team changes');
			}
		}
	}

	public onSelfRemoved(): void {
		// this.unsubscribe('onSelfRemoved');
	}

	private setMembersCount(team?: ITeamDto): void {
		if (team) {
			const count = (role: MemberRole): number =>
				team.members?.filter(m => m.roles?.indexOf(role) || -1 >= 0)?.length || 0;
			this.contributorsCount = count(MemberRoleContributor);
			this.spectatorsCount = count(MemberRoleSpectator);
		} else {
			this.contributorsCount = undefined;
			this.spectatorsCount = undefined;
		}
	}
}
