import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { ICalendariumSpaceDbo } from '@sneat/mod-schedulus-core';
import { SpaceModuleService } from '@sneat/team-services';

@Injectable()
export class CalendariumSpaceService extends SpaceModuleService<ICalendariumSpaceDbo> {
	public constructor(afs: AngularFirestore) {
		super('calendarium', afs);
	}
}
