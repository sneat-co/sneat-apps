import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IContactBrief, IContactusSpaceDbo } from '@sneat/contactus-core';
import { SpaceModuleService } from '@sneat/team-services';

@Injectable()
export class ContactusSpaceService extends SpaceModuleService<IContactusSpaceDbo> {
	public constructor(afs: AngularFirestore) {
		super('contactus', afs);
	}

	public readonly watchContactBriefs = (spaceID: string) =>
		this.watchBriefs<IContactBrief>(spaceID, (dto) => dto?.contacts || {});
}
