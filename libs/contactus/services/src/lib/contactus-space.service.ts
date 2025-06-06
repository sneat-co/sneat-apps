import { Injectable, inject } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IContactBrief, IContactusSpaceDbo } from '@sneat/contactus-core';
import { SpaceModuleService } from '@sneat/space-services';

@Injectable()
export class ContactusSpaceService extends SpaceModuleService<IContactusSpaceDbo> {
	public constructor() {
		const afs = inject(AngularFirestore);

		super('contactus', afs);
	}

	public readonly watchContactBriefs = (spaceID: string) => {
		console.log(`ContactusSpaceService.watchContactBriefs(${spaceID})`);
		return this.watchBriefs<IContactBrief>(
			spaceID,
			(dto) => dto?.contacts || {},
		);
	};
}
