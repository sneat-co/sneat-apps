import { Injectable } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactRoleBrief } from '@sneat/contactus-core';
import { Observable, of } from 'rxjs';
import { defaultFamilyContactGroups } from './contact-group-service';

@Injectable()
export class ContactRoleService {
  getContactRoleByID(id: string): Observable<IIdAndBrief<IContactRoleBrief>> {
    for (const cg of defaultFamilyContactGroups) {
      for (let j = 0; j < (cg?.dbo?.roles?.length || 0); j++) {
        const role = cg.dbo?.roles && cg.dbo.roles[j];
        if (role?.id === id) {
          return of({ id, brief: role.brief });
        }
      }
    }
    return of({ id, brief: { title: id } });
  }
}
