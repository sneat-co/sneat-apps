import { Inject, Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ICalendarDayBrief, ICalendarDayDto } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { tap } from 'rxjs';
import { ModuleTeamItemService } from './team-item.service';

@Injectable()
export class CalendarDayService {
	private readonly teamItemService: ModuleTeamItemService<
		ICalendarDayBrief,
		ICalendarDayDto
	>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new ModuleTeamItemService(
			'calendarium',
			'calendar_days',
			afs,
			sneatApiService,
		);
	}

	public watchTeamDay(team: ITeamContext, dateID: string) {
		console.log('ScheduleDayService.watchTeamDay()', team.id, dateID);
		return this.teamItemService
			.watchTeamItemByIdWithTeamRef(team, dateID)
			.pipe(
				tap((scheduleDay) =>
					console.log(
						'ScheduleDayService.watchTeamDay() => scheduleDay',
						scheduleDay,
						scheduleDay.dto,
					),
				),
			);
	}
}

@NgModule({
	providers: [CalendarDayService],
})
export class CalendarDayServiceModule {}
