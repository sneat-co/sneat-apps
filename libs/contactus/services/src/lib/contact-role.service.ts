import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
	defaultFamilyContactGroups,
	IContactRoleContext,
} from './contact-group-service';

@Injectable()
export class ContactRoleService {
	getContactRoleByID(id: string): Observable<IContactRoleContext> {
		for (let i = 0; i < defaultFamilyContactGroups.length; i++) {
			const cg = defaultFamilyContactGroups[i];
			for (let j = 0; j < (cg?.dto?.roles?.length || 0); j++) {
				const role = cg.dto?.roles[j];
				if (role?.id === id) {
					return of({ id, brief: role });
				}
			}
		}
		return of({ id });
	}
}
