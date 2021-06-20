import {Component, Inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {TeamService} from '../../../../../services/src/lib/team.service';
import {NavController} from '@ionic/angular';
import {TeamNavService} from '../../../../../services/src/lib/team-nav.service';
import {ITeam, MemberRole, MemberRoleEnum} from '@sneat/team-models';
import {IRecord} from '@sneat/data';

@Component({
  selector: 'app-team-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnChanges {

  @Input() public team: IRecord<ITeam>;

  public membersRoleTab: MemberRole | '*' = MemberRoleEnum.contributor;
  public contributorsCount: number;
  public spectatorsCount: number;

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
    this.navService.navigateToAddMember(this.navController, this.team);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.team) {
      try {
        this.setMembersCount(this.team?.data);
      } catch (e) {
        this.errorLogger.logError(e, 'Failed to process team changes');
      }
    }
  }

  public onSelfRemoved(): void {
    // this.unsubscribe('onSelfRemoved');
  }

  private setMembersCount(team?: ITeam): void {
    if (team) {
      const count = (role: MemberRole): number => team.members?.filter(m => m.roles?.indexOf(role) >= 0)?.length || 0;
      this.contributorsCount = count(MemberRoleEnum.contributor);
      this.spectatorsCount = count(MemberRoleEnum.spectator);
    } else {
      this.contributorsCount = undefined;
      this.spectatorsCount = undefined;
    }
  }

}
