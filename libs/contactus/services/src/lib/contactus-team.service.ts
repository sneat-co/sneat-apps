import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IContactBrief, IContactDto } from '@sneat/dto';
import { IContactusTeamDto, ITeamContext } from '@sneat/team-models';
import { TeamModuleService } from '@sneat/team-services';

@Injectable({ providedIn: 'root' }) // TODO: Do not provide in root
export class ContactusTeamService extends TeamModuleService<IContactusTeamDto> {
	public constructor(afs: AngularFirestore) {
		super('contactus', afs);
	}

	readonly watchContactBriefs = (team: ITeamContext) =>
		this.watchBriefs<IContactBrief, IContactDto>(
			team,
			(dto) => dto?.contacts || {},
		);
}
