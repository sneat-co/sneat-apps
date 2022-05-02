import { Inject, Injectable, NgModule } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { NewHappeningParams } from './view-models';

@Injectable()
export class ScheduleNavService {
	constructor(
		private readonly teamNavService: TeamNavService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	goNewHappening(team: ITeamContext, params: NewHappeningParams): void {
		this.teamNavService
			.navigateForwardToTeamPage(team, 'new-happening', {
				queryParams: params,
			})
			.catch(this.errorLogger.logErrorHandler('failed to navigate to new happening page'));
	}
}

@NgModule({
	providers: [ScheduleNavService],
})
export class ScheduleNavServiceModule {
}
