import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { IIdAndBriefAndOptionalDto } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IContactDto,
	MemberRole,
	IContactContext,
	ICreateContactRequest,
} from '@sneat/contactus-core';
import {
	ITeamContext,
	ITeamItemWithBriefAndDto,
	ITeamItemWithOptionalBriefAndOptionalDto,
} from '@sneat/team-models';
import { ModuleTeamItemService } from '@sneat/team-services';
import { ContactusTeamService } from './contactus-team.service';
import { map, Observable, throwError } from 'rxjs';
import {
	IContactRequest,
	ISetContactsStatusRequest,
	IUpdateContactRequest,
} from './dto';

@Injectable({ providedIn: 'root' })
export class ContactService extends ModuleTeamItemService<
	IContactBrief,
	IContactDto
> {
	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
		protected contactusTeamService: ContactusTeamService,
		private readonly userService: SneatUserService,
	) {
		super('contactus', 'contacts', afs, sneatApiService);
		// this.briefService = new TeamItemService<{id: string}, IContactsBrief>('briefs', afs, sneatApiService);
	}

	public createContact(
		team: ITeamContext,
		request: ICreateContactRequest,
		endpoint = 'contactus/create_contact',
	): Observable<ITeamItemWithBriefAndDto<IContactBrief, IContactDto>> {
		return this.createTeamItem(endpoint, team, request);
	}

	public deleteContact(request: IContactRequest): Observable<void> {
		return this.deleteTeamItem('contactus/delete_contact', request);
	}

	public updateContact(request: IUpdateContactRequest): Observable<void> {
		return this.sneatApiService.post('contactus/update_contact', request);
	}

	public setContactsStatus(
		status: 'archived' | 'active',
		teamID: string,
		contactIDs: readonly string[],
	): Observable<void> {
		if (!contactIDs?.length) {
			return throwError(() => 'at least 1 contact is required');
		}
		const request: ISetContactsStatusRequest = {
			teamID,
			status,
			contactIDs,
		};
		return this.sneatApiService.post('contactus/set_contacts_status', request);
	}

	watchContactsWithRole(
		team: ITeamContext,
		role: string,
		status: 'active' | 'archived' = 'active',
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>[]> {
		filter = [
			...(filter || []),
			{ field: 'roles', operator: '==', value: role },
		];
		return this.watchTeamContacts(team, status, filter);
	}

	watchTeamContacts(
		team: ITeamContext,
		status: 'active' | 'archived' = 'active',
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>[]> {
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
		return this.watchModuleTeamItemsWithTeamRef<IContactDto>(team, filter);
	}

	watchContactById(
		team: ITeamContext,
		contactID: string,
	): Observable<
		ITeamItemWithOptionalBriefAndOptionalDto<IContactBrief, IContactDto>
	> {
		return this.watchTeamItemByIdWithTeamRef(team, contactID);
	}

	watchContactsByRole(
		team: ITeamContext,
		filter?: IContactsFilter,
	): Observable<IContactContext[]> {
		console.log('watchContactsByRole, filter:', filter);
		const f: IFilter[] = [
			// { field: 'teamID', value: team.id, operator: '==' },
		];
		if (filter?.status) {
			f.push({ field: 'status', value: filter.status, operator: '==' });
		}
		if (filter?.role) {
			f.push({
				field: 'roles',
				operator: 'array-contains',
				value: filter.role,
			});
		}
		return this.watchModuleTeamItemsWithTeamRef(team, f);
	}

	watchChildContacts(
		team: ITeamContext,
		id: string,
		filter: IContactsFilter = { status: 'active' },
	): Observable<IContactContext[]> {
		console.log('watchRelatedContacts, id:', id);
		const f: IFilter[] = [
			{ field: 'parentContactID', value: id, operator: '==' },
		];
		if (filter.status) {
			f.push({ field: 'status', value: filter.status, operator: '==' });
		}
		if (filter.role) {
			f.push({
				field: 'roles',
				operator: 'array-contains',
				value: filter.role,
			});
		}
		return this.watchModuleTeamItemsWithTeamRef(team, f);
	}

	public changeContactRole(
		teamID: string,
		contactID: string,
		role: MemberRole,
	): Observable<void> {
		return this.sneatApiService
			.post(`contactus/change_member_role`, {
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

	public removeTeamMember(
		// TODO: move to members service?
		teamID: string,
		contactID: string,
	): Observable<ITeamContext> {
		console.log(`removeTeamMember(teamID=${teamID}, contactID=${contactID})`);

		if (!teamID) {
			return throwError(() => 'teamID parameters is required');
		}
		if (!contactID) {
			return throwError(() => 'contactID is required parameter');
		}

		const request: IContactRequest = { teamID, contactID };
		return this.sneatApiService.post('contactus/remove_member', request);
	}
}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
