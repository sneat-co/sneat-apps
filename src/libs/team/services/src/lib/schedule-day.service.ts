import { Inject, Injectable, NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatFirestoreService } from '@sneat/api';
import { INavContext } from '@sneat/core';
import { IScheduleDayDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Observable, shareReplay, tap } from 'rxjs';


@Injectable()
export class ScheduleDayService {
	private readonly sfs: SneatFirestoreService<IScheduleDayDto, IScheduleDayDto>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<IScheduleDayDto, IScheduleDayDto>(
			'schedule_days', afs,
			(id: string, dto: IScheduleDayDto) => ({ id, ...dto }), // TODO: we do not need this mapping?
		);
	}

	public watchTeamDay(teamID: string, dateID: string) {
		console.log('ScheduleDayService.watchTeamDay()', teamID, dateID);
		const id = `${teamID}:${dateID}`;
		return this.sfs
			.watchByID(id)
			.pipe(
				tap(scheduleDay => console.log('ScheduleDayService.watchTeamDay() => scheduleDay', id, scheduleDay.dto)),
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
