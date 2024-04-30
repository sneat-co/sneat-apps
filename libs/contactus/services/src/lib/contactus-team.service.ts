import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IContactBrief, IContactusTeamDto } from '@sneat/contactus-core';
import { TeamModuleService } from '@sneat/team-services';

@Injectable({ providedIn: 'root' }) // TODO: Do not provide in root
export class ContactusTeamService extends TeamModuleService<IContactusTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('contactus', afs);
	}

	public readonly watchContactBriefs = (teamID: string) =>
		this.watchBriefs<IContactBrief>(teamID, (dto) => dto?.contacts || {});
}
