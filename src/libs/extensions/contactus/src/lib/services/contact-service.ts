import { Injectable } from '@angular/core';
import { IFilter, SneatFirestoreService } from '@sneat/api';
import { ContactRole, IContactBrief, IContactDto, TeamCounter } from '@sneat/dto';
import { IContactContext, ICreateContactRequest, ITeamContext } from '@sneat/team/models';
import { TeamItemBaseService } from '@sneat/team/services';
import { Observable, throwError } from 'rxjs';

export const contactBriefFromDto = (id: string, dto: IContactDto): IContactBrief => ({ id, ...dto });

@Injectable()
export class ContactService {
	private readonly sfs: SneatFirestoreService<IContactBrief, IContactDto>;

	constructor(
		private readonly teamItemService: TeamItemBaseService,
	) {
		this.sfs = new SneatFirestoreService('team_contacts', teamItemService.afs, contactBriefFromDto);
	}

	createContact(request: ICreateContactRequest, endpoint = 'contacts/create_contact'): Observable<IContactContext> {
		return this.teamItemService.createTeamItem(endpoint, TeamCounter.contacts, request);
	}

	deleteContact(contact: IContactContext): Observable<void> {
		return throwError(() => 'not implemented yet');
	}

	watchTeamContacts(team: ITeamContext): Observable<IContactContext[]> {
		return this.teamItemService.watchTeamItems<IContactBrief, IContactDto>(team, 'team_contacts', 'teamID');
	}

	watchById(teamID: string, contactID: string): Observable<IContactContext> {
		return this.sfs.watchByID(`${teamID}:${contactID}`);
	}

	watchContactsByRole(team: ITeamContext, filter?: IContactsFilter): Observable<IContactContext[]> {
		const f: IFilter[] = [
			{ field: 'teamID', value: team.id, operator: '==' },
		];
		if (filter?.status) {
			f.push({ field: 'status', value: filter.status, operator: '==' });
		}
		if (filter?.role) {
			f.push({ field: 'roles', operator: 'array-contains', value: filter.role });
		}
		return this.sfs.watchByFilter(f);
	}
}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
