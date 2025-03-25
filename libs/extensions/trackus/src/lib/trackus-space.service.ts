import { Injectable, NgModule } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SpaceModuleService } from '@sneat/space-services';
import { ITrackusSpaceDbo } from './dbo/i-trackus-space-dbo';

@Injectable()
export class TrackusSpaceService extends SpaceModuleService<ITrackusSpaceDbo> {
	constructor(afs: AngularFirestore) {
		super('trackus', afs);
	}
}

@NgModule({
	providers: [TrackusSpaceService],
})
export class TrackusSpaceServiceModule {}
