import { Inject, Injectable, NgModule } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceNavService } from '@sneat/team-services';
import { ISchedulePageParams, NewHappeningParams } from './view-models';

@Injectable()
export class ScheduleNavService {
	constructor(
		private readonly spaceNavService: SpaceNavService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	goSchedule(
		team: ISpaceContext,
		queryParams?: ISchedulePageParams,
	): Promise<boolean> {
		return this.spaceNavService.navigateForwardToSpacePage(team, 'schedule', {
			queryParams,
		});
	}

	goNewHappening(team: ISpaceContext, params: NewHappeningParams): void {
		console.log('ScheduleNavService.goNewHappening()', params);
		this.spaceNavService
			.navigateForwardToSpacePage(team, 'new-happening', {
				queryParams: params,
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to new happening page',
				),
			);
	}
}

@NgModule({
	providers: [ScheduleNavService],
})
export class ScheduleNavServiceModule {}
