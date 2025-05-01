import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { IFilter, SneatApiService } from '@sneat/api';
import { SneatUserService } from '@sneat/auth-core';
import { IIdAndBriefAndOptionalDbo, ISpaceRef } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IContactDbo,
	MemberRole,
	IContactContext,
	ICreateContactRequest,
	IContactWithDboAndSpace,
} from '@sneat/contactus-core';
import {
	ISpaceContext,
	ISpaceItemWithOptionalBriefAndOptionalDbo,
} from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { ContactusSpaceService } from './contactus-space.service';
import { map, Observable, tap, throwError } from 'rxjs';
import {
	IContactRequest,
	IContactRequestWithOptionalMessage,
	ISetContactsStatusRequest,
	IUpdateContactRequest,
	validateContactRequest,
	validateUpdateContactRequest,
} from './dto';

export interface IChangeMemberRoleRequest {
	readonly spaceID: string;
	readonly contactID: string;
	readonly role: MemberRole;
}

@Injectable()
export class ContactService extends ModuleSpaceItemService<
	IContactBrief,
	IContactDbo
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
		spaceRef: ISpaceRef,
		request: ICreateContactRequest,
		endpoint = 'contactus/create_contact',
	): Observable<IContactWithDboAndSpace> {
		return this.createSpaceItem(endpoint, spaceRef, request);
	}

	public deleteContact(request: IContactRequest): Observable<void> {
		validateContactRequest(request);
		return this.deleteSpaceItem('contactus/delete_contact', request);
	}

	public updateContact(request: IUpdateContactRequest): Observable<void> {
		validateUpdateContactRequest(request);
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
	): Observable<IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>[]> {
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
	): Observable<IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>[]> {
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
		return this.watchModuleSpaceItemsWithSpaceRef<IContactDbo>(space, {
			filter,
		});
	}

	watchContactById(
		space: ISpaceContext,
		contactID: string,
	): Observable<
		ISpaceItemWithOptionalBriefAndOptionalDbo<IContactBrief, IContactDbo>
	> {
		return this.watchSpaceItemByIdWithSpaceRef(space, contactID).pipe(
			tap((contact) => console.log('contact loaded:', contactID, contact)),
		);
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
			`removeTeamMember(spaceID=${request.spaceID}, contactID=${request.contactID})`,
		);
		try {
			validateContactRequest(request);
		} catch (ex) {
			return throwError(() => ex);
		}

		// const request: IContactRequest = { spaceID, contactID };
		return this.sneatApiService.post('contactus/remove_team_member', request);
	}
}

export interface IContactsFilter {
	status?: string;
	role?: ContactRole;
}
