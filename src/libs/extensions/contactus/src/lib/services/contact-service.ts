import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { ContactRole, IContactBrief, IContactDto, ITeamDto, MemberRole } from '@sneat/dto';
import {
	IContactContext,
	IContactusTeamContext,
	ICreateContactRequest,
	ITeamContext, ITeamMemberRequest,
	ITeamRef, ITeamRequest,
} from '@sneat/team/models';
import { ContactusTeamService, TeamItemService } from '@sneat/team/services';
import { map, Observable, switchMap, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IContactRequest, ISetContactAddressRequest, ISetContactRoleRequest } from '../dto';

@Injectable()
export class ContactService {

	protected readonly teamItemService: TeamItemService<IContactBrief, IContactDto>;

	// private readonly briefService: TeamItemService<{id: string}, IContactsBrief>;

	constructor(
		afs: AngularFirestore,
		protected sneatApiService: SneatApiService,
		protected contactusTeamService: ContactusTeamService,
	) {
		this.teamItemService = new TeamItemService<IContactBrief, IContactDto>('contacts', afs, sneatApiService);
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

	public setContactAddress(request: ISetContactAddressRequest): Observable<void> {
		return this.teamItemService.sneatApiService.post('contacts/set_contact_address', request);
	}

	public setContactRole(request: ISetContactRoleRequest): Observable<void> {
		return this.teamItemService.sneatApiService.post('contacts/set_contact_address', request);
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


	watchTeamContacts(team: ITeamContext, status: 'active' | 'archived' = 'active', filter?: IFilter[]): Observable<IContactContext[]> {
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
		team: ITeamRef,
		contactusTeam: IContactusTeamContext,
		contactID: string,
		role: MemberRole,
	): Observable<ITeamContext> {
		let contactBrief = contactusTeam?.dto?.contacts[contactID];
		if (!contactBrief) {
			return throwError(() => 'member not found by ID in team record');
		}
		return this.sneatApiService
			.post(`members/change_member_role`, {
				teamID: team.id,
				contactID,
				role,
			})
			.pipe(
				map(() => {
					if (!contactBrief) {
						throw new Error('member is no longer available');
					}
					contactBrief = { ...contactBrief, roles: [role] };
					return team;
				}),
			);
	}

	public removeTeamMember( // TODO: move to members service?
		contactusTeam: IContactusTeamContext,
		memberID: string,
	): Observable<ITeamContext> {
		console.log(
			`removeTeamMember(teamID: ${contactusTeam?.id}, memberID=${memberID})`,
		);
		if (!contactusTeam) {
			return throwError(() => 'teamRecord parameters is required');
		}
		const id = contactusTeam.id;
		if (!id) {
			return throwError(() => 'teamRecord.id parameters is required');
		}
		if (!memberID) {
			return throwError(() => 'memberId is required parameter');
		}
		const updateTeam = (team: ITeamContext) => {
			if (team?.dto) {
				team = {
					...team,
					dto: {
						...team.dto,
						// TODO: members: team.dto.members?.filter((m: IMemberBrief) => m.id !== memberID),
					},
				};
			}
			this.onTeamUpdated(team);
		};
		const processRemoveTeamMemberResponse = (team: ITeamRef): Observable<ITeamContext> =>
			this.getTeam(team).pipe(
				tap(updateTeam),
				// map(team => team.members.find(m => m.uid === this.userService.currentUserId) ? team : null),
			);
		const ensureTeamRecordExists = map((team: ITeamContext) => {
			if (!team?.dto) {
				throw new Error('team record is expected to exist');
			}
			return team;
		});
		if (contactusTeam?.dto?.contacts) {
			const member = contactusTeam.dto.contacts[memberID];
			if (member?.userID === this.userService.currentUserID) {
				const teamRequest: ITeamRequest = {
					teamID: contactusTeam.id,
				};
				this.sneatApiService
					.post<ITeamDto>('members/leave_team', teamRequest)
					.pipe(
						map(teamDto => {
							const teamContext: ITeamContext = { id, type: teamDto.type, brief: teamDto, dto: teamDto };
							return teamContext;
						}),
						switchMap(processRemoveTeamMemberResponse),
						ensureTeamRecordExists,
					);
			}
		}
		const request: ITeamMemberRequest = {
			teamID: contactusTeam.id,
			memberID: memberID,
		};
		return this.sneatApiService
			.post('members/remove_member', request)
			.pipe(
				switchMap(() => processRemoveTeamMemberResponse(contactusTeam)),
				ensureTeamRecordExists,
			);
	}

}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
