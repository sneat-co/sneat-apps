import { Injectable, inject, Injector } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { ICalendariumSpaceDbo } from '@sneat/mod-schedulus-core';
import { SpaceModuleService } from '@sneat/space-services';

@Injectable()
export class CalendariumSpaceService extends SpaceModuleService<ICalendariumSpaceDbo> {
	public constructor() {
		const afs = inject(AngularFirestore);
		super(inject(Injector), 'calendarium', afs);
	}
}
