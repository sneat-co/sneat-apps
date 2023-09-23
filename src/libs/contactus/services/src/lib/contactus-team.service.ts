import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IContactContext, IContactusTeamDto, ITeamContext } from '@sneat/team/models';
import { TeamModuleService } from '@sneat/team/services';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactusTeamService extends TeamModuleService<IContactusTeamDto, IContactusTeamDto> {

	public constructor(
		afs: AngularFirestore,
		// sneatApiService: SneatApiService,
	) {
		super('contactus', afs);
	}

	watchContactBriefs(team: ITeamContext): Observable<IContactContext[]> {
		const o = this.watchTeamModuleRecord(team);
		const result = o.pipe(
			map(contactusTeam => {
				const contacts = contactusTeam?.dto?.contacts;
				const cc: IContactContext[] = contacts
					? Object.keys(contacts).map(id => ({ id, brief: contacts[id], team }))
					: [];
				return cc;
			}),
		);
		return result;
	}
}
