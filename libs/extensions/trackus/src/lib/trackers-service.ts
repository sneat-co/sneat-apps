import { Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { ModuleSpaceItemService } from '@sneat/team-services';
import { ITrackerBrief, ITrackerDbo } from './dbo/i-tracker-dbo';

@Injectable()
export class TrackersService extends ModuleSpaceItemService<
	ITrackerBrief,
	ITrackerDbo
> {
	constructor(afs: AngularFirestore, sneatApiService: SneatApiService) {
		super('trackus', 'trackers', afs, sneatApiService);
	}
}

@NgModule({
	providers: [TrackersService],
})
export class TrackersServiceModule {}
