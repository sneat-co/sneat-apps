import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IContactDto,
	MemberRole,
	IContactContext,
	ICreateContactRequest,
} from '@sneat/contactus-core';
import {
	ISpaceContext,
	ISpaceItemWithBriefAndDbo,
	ISpaceItemWithOptionalBriefAndOptionalDbo,
} from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { ContactusSpaceService } from './contactus-space.service';
import { map, Observable, throwError } from 'rxjs';
import {
	IContactRequest,
	IContactRequestWithOptionalMessage,
	ISetContactsStatusRequest,
	IUpdateContactRequest,
	validateContactRequest,
} from './dto';

export interface IChangeMemberRoleRequest {
	readonly spaceID: string;
	readonly contactID: string;
	readonly role: MemberRole;
}

@Injectable()
export class ContactService extends ModuleSpaceItemService<
	IContactBrief,
	IContactDto
> {
	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
		protected contactusSpaceService: ContactusSpaceService,
		private readonly userService: SneatUserService,
	) {
		super('contactus', 'contacts', afs, sneatApiService);
		// this.briefService = new TeamItemService<{id: string}, IContactsBrief>('briefs', afs, sneatApiService);
	}

	public createContact(
		space: ISpaceContext,
		request: ICreateContactRequest,
		endpoint = 'contactus/create_contact',
	): Observable<ISpaceItemWithBriefAndDbo<IContactBrief, IContactDto>> {
		return this.createSpaceItem(endpoint, space, request);
	}

	public deleteContact(request: IContactRequest): Observable<void> {
		return this.deleteSpaceItem('contactus/delete_contact', request);
	}

	public updateContact(request: IUpdateContactRequest): Observable<void> {
		return this.sneatApiService.post('contactus/update_contact', request);
	}

	public setContactsStatus(
		request: ISetContactsStatusRequest,
	): Observable<void> {
		if (!request.contactIDs?.length) {
			return throwError(() => 'at least 1 contact is required');
		}
		return this.sneatApiService.post('contactus/set_contacts_status', request);
	}

	watchContactsWithRole(
		space: ISpaceContext,
		role: string,
		status: 'active' | 'archived' = 'active',
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndOptionalDbo<IContactBrief, IContactDto>[]> {
		filter = [
			...(filter || []),
			{ field: 'roles', operator: '==', value: role },
		];
		return this.watchSpaceContacts(space, status, filter);
	}

	public watchSpaceContacts(
		space: ISpaceContext,
		status: 'active' | 'archived' = 'active',
		filter?: readonly IFilter[],
	): Observable<IIdAndBriefAndOptionalDbo<IContactBrief, IContactDto>[]> {
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
		return this.watchModuleSpaceItemsWithSpaceRef<IContactDto>(space, {
			filter,
		});
	}

	watchContactById(
		space: ISpaceContext,
		contactID: string,
	): Observable<
		ISpaceItemWithOptionalBriefAndOptionalDbo<IContactBrief, IContactDto>
	> {
		return this.watchSpaceItemByIdWithSpaceRef(space, contactID);
	}

	watchContactsByRole(
		space: ISpaceContext,
		filter?: IContactsFilter,
	): Observable<IContactContext[]> {
		console.log('watchContactsByRole, filter:', filter);
		const f: IFilter[] = [
			// { field: 'spaceID', value: team.id, operator: '==' },
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
		return this.watchModuleSpaceItemsWithSpaceRef(space, { filter: f });
	}

	watchChildContacts(
		space: ISpaceContext,
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
		return this.watchModuleSpaceItemsWithSpaceRef(space, { filter: f });
	}

	public changeContactRole(
		request: IChangeMemberRoleRequest,
	): Observable<void> {
		return this.sneatApiService
			.post(`contactus/change_member_role`, request)
			.pipe(
				map(() => {
					return;
				}),
			);
	}

	public removeSpaceMember(
		request: IContactRequestWithOptionalMessage,
	): Observable<ISpaceContext> {
		console.log(
			`removeTeamMember(teamID=${request.spaceID}, contactID=${request.contactID})`,
		);
		try {
			validateContactRequest(request);
		} catch (ex) {
			return throwError(() => ex);
		}

		// const request: IContactRequest = { teamID, contactID };
		return this.sneatApiService.post('contactus/remove_team_member', request);
	}
}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
