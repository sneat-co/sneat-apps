import { Inject, Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IScheduleDayBrief, IScheduleDayDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { tap } from 'rxjs';
import { TeamItemService } from './team-item.service';


@Injectable()
export class ScheduleDayService {
	private readonly teamItemService: TeamItemService<IScheduleDayBrief, IScheduleDayDto>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService<IScheduleDayBrief, IScheduleDayDto>(
			'schedule_days', afs, sneatApiService,
		);
	}

	public watchTeamDay(team: ITeamContext, dateID: string) {
		console.log('ScheduleDayService.watchTeamDay()', team.id, dateID);
		return this.teamItemService
			.watchTeamItemByID(team, dateID)
			.pipe(
				tap(scheduleDay => console.log('ScheduleDayService.watchTeamDay() => scheduleDay', scheduleDay, scheduleDay.dto)),
			);
	}
}

@NgModule({
	providers: [
		ScheduleDayService,
	],
})
export class ScheduleDayServiceModule {
}
