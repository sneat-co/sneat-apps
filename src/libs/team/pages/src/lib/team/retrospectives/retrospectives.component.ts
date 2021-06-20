import {Component, Inject, Input} from '@angular/core';
import {TeamService} from '../../../../../services/src/lib/team.service';
import {TeamNavService} from '../../../../../services/src/lib/team-nav.service';
import {NavController} from '@ionic/angular';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import {IRecord} from '@sneat/data';
import {ITeam} from '@sneat/team-models';
import {SneatUserService} from '@sneat/auth';
import {RetroItemType} from '@sneat/scrumspace/retrospectives';

@Component({
  selector: 'app-team-retrospectives',
  templateUrl: './retrospectives.component.html',
  styleUrls: ['./retrospectives.component.scss'],
})
export class RetrospectivesComponent {

  @Input() public team: IRecord<ITeam>;

  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
    private readonly teamService: TeamService,
    private readonly userService: SneatUserService, // TODO: replace with user context service
    private readonly navController: NavController,
    public readonly navService: TeamNavService,
  ) {
  }

  navigateToCurrentRetro(): void {
    console.log('navigateToCurrentRetro()');
    try {
      this.navService.navigateToRetrospective(this.navController, this.team, this.team?.data.active?.retrospective?.id || 'upcoming');
    } catch (e) {
      this.errorLogger.logError(e, 'Failed to navigate to retrospective page');
    }
  }

  retroCount(itemType: RetroItemType): number {
    return this.team?.data?.upcomingRetro?.itemsByUserAndType?.[this.userService.currentUserId]?.[itemType] || 0;
  }
}
