import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IContactBrief, IContactusTeamDto } from '@sneat/contactus-core';
import { ITeamContext } from '@sneat/team-models';
import { TeamModuleService } from '@sneat/team-services';

@Injectable({ providedIn: 'root' }) // TODO: Do not provide in root
export class ContactusTeamService extends TeamModuleService<IContactusTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('contactus', afs);
	}

	public readonly watchContactBriefs = (team: ITeamContext) =>
		this.watchBriefs<IContactBrief>(team.id, (dto) => dto?.contacts || {});
}
