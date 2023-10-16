import { Inject, Injectable, NgModule } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { ISchedulePageParams, NewHappeningParams } from './view-models';

@Injectable()
export class ScheduleNavService {
	constructor(
		private readonly teamNavService: TeamNavService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {}

	goSchedule(
		team: ITeamContext,
		queryParams?: ISchedulePageParams,
	): Promise<boolean> {
		return this.teamNavService.navigateForwardToTeamPage(team, 'schedule', {
			queryParams,
		});
	}

	goNewHappening(team: ITeamContext, params: NewHappeningParams): void {
		console.log('ScheduleNavService.goNewHappening()', params);
		this.teamNavService
			.navigateForwardToTeamPage(team, 'new-happening', {
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
