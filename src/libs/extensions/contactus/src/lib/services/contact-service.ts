import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { ContactRole, IContactBrief, IContactDto, TeamCounter } from '@sneat/dto';
import { IContactContext, ICreateContactRequest, ITeamContext } from '@sneat/team/models';
import { TeamItemService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ContactService {

	private readonly teamItemService: TeamItemService<IContactBrief, IContactDto>;

	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService<IContactBrief, IContactDto>('contacts', afs, sneatApiService);
	}

	createContact(team: ITeamContext, request: ICreateContactRequest, endpoint = 'contacts/create_contact'): Observable<IContactContext> {
		return this.teamItemService.createTeamItem(endpoint, team, request);
	}

	deleteContact(contact: IContactContext): Observable<void> {
		return throwError(() => 'not implemented yet');
	}

	watchTeamContacts(team: ITeamContext, status: 'active' | 'archived' = 'active', filter?: IFilter[]): Observable<IContactContext[]> {
		if (!filter) {
			filter = [];
		}
		filter.push(
			{
				field: 'status',
				value: status,
				operator: '==',
			},
			{
				field: 'parentContactID',
				operator: '==',
				value: '',
			},
		);
		return this.teamItemService.watchTeamItems<IContactBrief, IContactDto>(team, filter);
	}

	watchContactById(team: ITeamContext, contactID: string): Observable<IContactContext> {
		return this.teamItemService.watchTeamItemByID(team, contactID);
	}

	watchContactsByRole(team: ITeamContext, filter?: IContactsFilter): Observable<IContactContext[]> {
		console.log('watchContactsByRole, filter:', filter);
		const f: IFilter[] = [
			// { field: 'teamID', value: team.id, operator: '==' },
		];
		if (filter?.status) {
			f.push({ field: 'status', value: filter.status, operator: '==' });
		}
		if (filter?.role) {
			f.push({ field: 'roles', operator: 'array-contains', value: filter.role });
		}
		return this.teamItemService.watchTeamItems(team, f);
	}
}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
