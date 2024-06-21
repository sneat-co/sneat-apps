import { Inject, Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ICalendarDayBrief, ICalendarDayDbo } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team-models';
import { tap } from 'rxjs';
import { ModuleTeamItemService } from './team-item.service';

@Injectable()
export class CalendarDayService {
	private readonly teamItemService: ModuleTeamItemService<
		ICalendarDayBrief,
		ICalendarDayDbo
	>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		public readonly afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new ModuleTeamItemService(
			'calendarium',
			'days',
			afs,
			sneatApiService,
		);
	}

	public watchTeamDay(team: ITeamContext, dateID: string) {
		console.log(
			`ScheduleDayService.watchTeamDay(team={id=${team.id}, dateID=${dateID})`,
		);
		return this.teamItemService
			.watchTeamItemByIdWithTeamRef(team, dateID)
			.pipe(
				tap((scheduleDay) =>
					console.log(
						'ScheduleDayService.watchTeamDay() => scheduleDay',
						scheduleDay,
						scheduleDay.dbo,
					),
				),
			);
	}
}

@NgModule({
	providers: [CalendarDayService],
})
export class CalendarDayServiceModule {}
