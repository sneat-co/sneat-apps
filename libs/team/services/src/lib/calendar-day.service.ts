import { Inject, Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ICalendarDayBrief, ICalendarDayDbo } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { tap } from 'rxjs';
import { ModuleSpaceItemService } from './space-item.service';

@Injectable()
export class CalendarDayService {
	private readonly spaceItemService: ModuleSpaceItemService<
		ICalendarDayBrief,
		ICalendarDayDbo
	>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		public readonly afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.spaceItemService = new ModuleSpaceItemService(
			'calendarium',
			'days',
			afs,
			sneatApiService,
		);
	}

	public watchSpaceDay(team: ISpaceContext, dateID: string) {
		console.log(
			`ScheduleDayService.watchTeamDay(team={id=${team.id}, dateID=${dateID})`,
		);
		return this.spaceItemService
			.watchSpaceItemByIdWithSpaceRef(team, dateID)
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
