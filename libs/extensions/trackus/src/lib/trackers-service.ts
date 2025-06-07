import { Injectable, Injector, NgModule, inject } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { ITrackerBrief, ITrackerDbo } from './dbo/i-tracker-dbo';

@Injectable()
export class TrackersService extends ModuleSpaceItemService<
	ITrackerBrief,
	ITrackerDbo
> {
	constructor() {
		const afs = inject(AngularFirestore);
		const sneatApiService = inject(SneatApiService);
		const injector = inject(Injector);
		super(injector, 'trackus', 'trackers', afs, sneatApiService);
	}
}

@NgModule({
	providers: [TrackersService],
})
export class TrackersServiceModule {}
