import { inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { AnalyticsService } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ISpaceDbo } from '@sneat/dto';
import { IRetrospective } from '../models/models-retrospectives';
import { IScrumDbo } from '../models/models-dailyscrum';
import { ScrumPageTab } from '@sneat/space-services';

@Injectable()
export class ScrumusNavService {
  // TODO: remove, use SpaceNavService
  private readonly analyticsService = inject(AnalyticsService);

  public navigateToRetroTree(
    date: 'today' | 'yesterday' | string,
    space?: IRecord<ISpaceDbo>,
    retrospective?: IRecord<IRetrospective>,
  ): void {
    console.log(
      `navigateToRetroReview(date=${date}, space=${space?.id}), scrum:`,
      retrospective?.dbo,
    );
    if (!space) {
      return;
    }
    this.analyticsService.logEvent('navigateToRetroReview', {
      date,
      space: space.id,
    });
    this.navController
      .navigateForward('retro-tree', {
        queryParams: { date, space: space.id },
        state: { space, retrospective },
      })
      .catch((err) =>
        this.errorLogger.logError(
          err,
          'Failed to navigate to retro review page',
        ),
      );
  }

  // TODO: Should not be part of generic service
  public navigateToScrum(
    date: 'today' | 'yesterday' | string,
    space: IRecord<ISpaceDbo>,
    scrum?: IRecord<IScrumDbo>,
    tab?: ScrumPageTab,
  ): void {
    console.log(
      `navigateToScrum(date=${date}, space=${space?.id}, tab=${tab}), scrum:`,
      scrum?.dbo,
    );
    this.analyticsService.logEvent('navigateToScrum', {
      date,
      space: space.id,
    });
    this.navController
      .navigateForward('scrum', {
        queryParams: { date, space: space.id },
        state: { space, scrum },
        fragment: tab && `tab=` + tab,
      })
      .catch((err) =>
        this.errorLogger.logError(err, 'Failed to navigate to scrum page'),
      );
  }

  // TODO: Should not be part of generic service
  public navigateToScrums = (
    navController: NavController,
    team: IRecord<ISpaceDbo>,
  ): void =>
    this.navToSpacePage(navController, team, 'scrums', 'navigateToScrums');

  // TODO: Should not be part of generic service
  public navigateToRetrospective = (
    navController: NavController,
    team: IRecord<ISpaceDbo>,
    id: string | 'upcoming',
  ): void =>
    this.navToSpacePage(
      navController,
      team,
      'retrospective',
      'navigateToRetrospective',
      { id },
    );
}
