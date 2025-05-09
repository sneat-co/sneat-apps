import {
	ContactRole,
	ContactType,
	IContactContext,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { ISelectorOptions } from '@sneat/ui';

export interface IContactSelectorProps {
	readonly space: ISpaceContext;
	readonly contactRole?: ContactRole;
	readonly contactType?: ContactType;
	readonly parentType?: ContactType;
	readonly parentRole?: ContactRole;
	readonly parentContact?: IContactContext;
	readonly subType?: ContactRole;
	readonly subRoleRequired?: boolean;
	readonly excludeContacts?: readonly IContactContext[];
	readonly okButtonLabel?: string;
}

export interface IContactSelectorOptions
	extends ISelectorOptions<IContactWithBriefAndSpace> {
	readonly componentProps?: IContactSelectorProps;
}

export interface ISelectedContact {
	readonly contact: IContactContext;
	readonly role: string;
}
