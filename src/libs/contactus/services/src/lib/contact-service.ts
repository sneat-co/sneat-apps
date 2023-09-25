import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { ContactRole, IContactBrief, IContactDto, MemberRole } from '@sneat/dto';
import {
	IContactContext,
	ICreateContactRequest,
	ITeamContext,
} from '@sneat/team/models';
import { TeamItemService } from '@sneat/team/services';
import { ContactusTeamService } from './contactus-team.service';
import { map, Observable, throwError } from 'rxjs';
import { IContactRequest, IUpdateContactRequest, ISetContactRolesRequest } from './dto';

@Injectable({ providedIn: 'root' })
export class ContactService {

	protected readonly teamItemService: TeamItemService<IContactBrief, IContactDto>;

	// private readonly briefService: TeamItemService<{id: string}, IContactsBrief>;

	constructor(
		afs: AngularFirestore,
		protected sneatApiService: SneatApiService,
		protected contactusTeamService: ContactusTeamService,
		private readonly userService: SneatUserService,
	) {
		this.teamItemService = new TeamItemService('contactus', 'contacts', afs, sneatApiService);
		// this.briefService = new TeamItemService<{id: string}, IContactsBrief>('briefs', afs, sneatApiService);
	}

	createContact(team: ITeamContext, request: ICreateContactRequest, endpoint = 'contacts/create_contact'): Observable<IContactContext> {
		return this.teamItemService.createTeamItem(endpoint, team, request);
	}

	deleteContact(contact: IContactContext): Observable<void> {
		const request: IContactRequest = {
			teamID: contact.team.id,
			contactID: contact.id,
		};
		return this.teamItemService.deleteTeamItem('contacts/delete_contact', request);
	}

	public updateContact(request: IUpdateContactRequest): Observable<void> {
		return this.teamItemService.sneatApiService.post('contacts/update_contact', request);
	}

	setContactsStatus(status: 'archived' | 'active', teamID: string, contacts: IContactContext[]): Observable<void> {
		if (!contacts?.length) {
			return throwError(() => 'at least 1 contact is required');
		}
		const request = {
			teamID,
			status,
			contactIDs: contacts.map(c => c.id),
		};
		return this.teamItemService.sneatApiService.post('contacts/set_contacts_status', request);
	}


	watchContactsWithRole(team: ITeamContext, role: string, status: 'active' | 'archived' = 'active', filter?: readonly IFilter[]): Observable<IContactContext[]> {
		filter = [...(filter || []), { field: 'roles', operator: '==', value: role }];
		return this.watchTeamContacts(team, status, filter);
	}

	watchTeamContacts(team: ITeamContext, status: 'active' | 'archived' = 'active', filter?: readonly IFilter[]): Observable<IContactContext[]> {
		filter = [
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
			...(filter || []),
		];
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

	watchChildContacts(team: ITeamContext, id: string, filter: IContactsFilter = { status: 'active' }): Observable<IContactContext[]> {
		console.log('watchRelatedContacts, id:', id);
		const f: IFilter[] = [
			{ field: 'parentContactID', value: id, operator: '==' },
		];
		if (filter.status) {
			f.push({ field: 'status', value: filter.status, operator: '==' });
		}
		if (filter.role) {
			f.push({ field: 'roles', operator: 'array-contains', value: filter.role });
		}
		return this.teamItemService.watchTeamItems(team, f);
	}

	public changeContactRole(
		teamID: string,
		contactID: string,
		role: MemberRole,
	): Observable<void> {
		return this.sneatApiService
			.post(`members/change_member_role`, {
				teamID,
				contactID,
				role,
			})
			.pipe(
				map(() => {
					return;
				}),
			);
	}

	public removeTeamMember( // TODO: move to members service?
		teamID: string,
		contactID: string,
	): Observable<ITeamContext> {
		console.log(
			`removeTeamMember(teamID: teamID=${teamID}, memberID=${contactID})`,
		);
		if (!teamID) {
			return throwError(() => 'teamID parameters is required');
		}
		if (!contactID) {
			return throwError(() => 'contactID is required parameter');
		}
		const request: IContactRequest = { teamID, contactID };
		return this.sneatApiService
			.post('members/remove_member', request);
	}
}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
