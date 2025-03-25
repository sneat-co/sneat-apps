import {
	ContactRole,
	ContactType,
	IContactContext,
} from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';

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
}
