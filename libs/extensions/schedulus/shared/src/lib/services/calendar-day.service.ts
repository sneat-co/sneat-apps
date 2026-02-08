import { Injectable, NgModule, inject, Injector } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ICalendarDayBrief, ICalendarDayDbo } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { tap } from 'rxjs';

@Injectable()
export class CalendarDayService {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	readonly afs = inject(AngularFirestore);

	private readonly spaceItemService: ModuleSpaceItemService<
		ICalendarDayBrief,
		ICalendarDayDbo
	>;

	constructor() {
		const afs = this.afs;
		const sneatApiService = inject(SneatApiService);
		const injector = inject(Injector);
		console.log('CalendarDayService.constructor()');
		this.spaceItemService = new ModuleSpaceItemService(
			injector,
			'calendarium',
			'days',
			afs,
			sneatApiService,
		);
	}

	public watchSpaceDay(space: ISpaceContext, dateID: string) {
		console.log(
			`CalendarDayService.watchSpaceDay(space={id=${space.id}, dateID=${dateID})`,
		);
		return this.spaceItemService
			.watchSpaceItemByIdWithSpaceRef(space, dateID)
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

@NgModule({ providers: [CalendarDayService] })
export class CalendarDayServiceModule {} // TODO: Should we simply pass to `provide: []`?
