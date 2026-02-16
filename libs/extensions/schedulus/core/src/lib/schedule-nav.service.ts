import { Injectable, inject } from '@angular/core';
import { excludeEmpty } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { ISchedulePageParams, NewHappeningParams } from './view-models';

@Injectable()
export class ScheduleNavService {
  private readonly spaceNavService = inject(SpaceNavService);
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

  public goCalendar(
    space: ISpaceContext,
    queryParams?: ISchedulePageParams,
  ): Promise<boolean> {
    return this.spaceNavService.navigateForwardToSpacePage(space, 'calendar', {
      queryParams,
    });
  }

  public goNewHappening(
    space: ISpaceContext,
    params: NewHappeningParams,
  ): void {
    this.spaceNavService
      .navigateForwardToSpacePage(space, 'new-happening', {
        queryParams: excludeEmpty(params),
      })
      .catch(
        this.errorLogger.logErrorHandler(
          'failed to navigate to new happening page',
        ),
      );
  }
}
