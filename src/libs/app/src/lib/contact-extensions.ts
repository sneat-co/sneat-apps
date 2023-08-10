import { InjectionToken } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';

export interface IContactRole {
	id: ContactRole;
	title: string;
	iconName?: string;
	// canBeRoles?: ContactRole[];
	canBeImpersonatedByRoles?: ContactRole[];
	childForRoles?: ContactRole[];
}

export interface IContactType {
	id: ContactType;
	title: string;
	icon?: string;
}

export type ContactRolesByType = Partial<Record<ContactType, IContactRole[]>>;

export const CONTACT_ROLES_BY_TYPE = new InjectionToken<ContactRolesByType>('CONTACT_ROLES_BY_TYPE');
