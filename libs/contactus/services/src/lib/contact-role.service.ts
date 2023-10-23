import { Injectable } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactRoleBrief } from '@sneat/dto';
import { Observable, of } from 'rxjs';
import { defaultFamilyContactGroups } from './contact-group-service';

@Injectable({ providedIn: 'root' }) // TODO: Dedicated module?
export class ContactRoleService {
	getContactRoleByID(id: string): Observable<IIdAndBrief<IContactRoleBrief>> {
		for (let i = 0; i < defaultFamilyContactGroups.length; i++) {
			const cg = defaultFamilyContactGroups[i];
			for (let j = 0; j < (cg?.dto?.roles?.length || 0); j++) {
				const role = cg.dto?.roles && cg.dto.roles[j];
				if (role?.id === id) {
					return of({ id, brief: role });
				}
			}
		}
		return of({ id, brief: { title: id } });
	}
}
