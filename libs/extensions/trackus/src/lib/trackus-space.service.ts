import { Injectable, NgModule, inject, Injector } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SpaceModuleService } from '@sneat/space-services';
import { ITrackusSpaceDbo } from './dbo/i-trackus-space-dbo';

@Injectable()
export class TrackusSpaceService extends SpaceModuleService<ITrackusSpaceDbo> {
	constructor() {
		const afs = inject(AngularFirestore);
		const injector = inject(Injector);
		super(injector, 'trackus', afs);
	}
}

@NgModule({
	providers: [TrackusSpaceService],
})
export class TrackusSpaceServiceModule {}
