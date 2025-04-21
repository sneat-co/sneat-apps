import {
	IIdAndBrief,
	IIdAndBriefAndDbo,
	IIdAndBriefAndOptionalDbo,
	ISpaceItemBriefWithSpace,
} from '@sneat/core';
import { ISpaceModuleItemRef, IWithRelatedAndRelatedIDs } from '@sneat/dto';
import { ISpaceRef } from '@sneat/core';
import { IContactBase } from './contact-base';
import { ContactRole } from './contact-roles';
import { IContact2Asset } from './contact2item';
import { IPersonRecord } from './person';

export interface IRelatedRolesRequest {
	readonly rolesOfItem?: string[];
	readonly rolesToItem?: string[];
}

export interface IRelatedChange {
	readonly add?: IRelatedRolesRequest;
	readonly remove?: IRelatedRolesRequest;
}

export interface IRelatedItemChange extends IRelatedChange {
	readonly itemRef: ISpaceModuleItemRef;
}

// // Default value: 'optional'
export type RequirementOption = 'required' | 'optional' | 'excluded';

export interface IContactBrief extends IContactBase {
	readonly parentID?: string;
}

export type IContactWithBrief = IIdAndBrief<IContactBrief>;

export function filterContactsByTextAndRole( // TODO(help-wanted): add test
	contacts: readonly IContactWithCheck[] | undefined,
	text: string,
	role?: ContactRole,
): readonly IContactWithCheck[] | undefined {
	return !text && !role
		? contacts
		: contacts?.filter((c) => {
				return isContactPassFilter(c, text, role);
			});
}

export function isContactPassFilter(
	c: IContactWithBrief,
	text: string,
	role?: ContactRole,
): boolean {
	const { brief } = c;
	const names = brief?.names;
	return (
		(!role || (!!c.brief?.roles && c?.brief.roles.includes(role))) &&
		(!text ||
			brief?.title?.toLowerCase().includes(text) ||
			(!!names &&
				(!!names.firstName?.toLowerCase().includes(text) ||
					!!names.lastName?.toLowerCase().includes(text) ||
					!!names.nickName?.toLowerCase().includes(text) ||
					!!names.middleName?.toLowerCase().includes(text) ||
					!!names.fullName?.toLowerCase().includes(text))))
	);
}

export interface IContactWithBriefAndSpace extends IContactWithBrief {
	readonly space: ISpaceRef;
}

export function addSpace<IBrief>(
	space: ISpaceRef,
): (item: IIdAndBrief<IBrief>) => ISpaceItemBriefWithSpace<IBrief> {
	return (item) => ({ ...item, space });
}

export interface IContactDbo
	extends IContactBase,
		IPersonRecord,
		IWithRelatedAndRelatedIDs {
	readonly assets?: IContact2Asset[]; // TODO: Remove as it can be replaced with IWithRelatedItems?
}

export type IContactWithDbo = IIdAndBriefAndDbo<IContactBrief, IContactDbo>;

export type IContactWithOptionalDbo = IIdAndBriefAndOptionalDbo<
	IContactBrief,
	IContactDbo
>;

export interface IContactsBrief {
	readonly contacts?: readonly IContactBrief[];
}

export interface IContactWithDboAndSpace
	extends IContactWithDbo,
		IContactWithBriefAndSpace {}

export interface IContactWithOptionalDboAndSpace
	extends IContactWithOptionalDbo,
		IContactWithBriefAndSpace {}

export interface IContactWithCheck extends IContactWithOptionalDboAndSpace {
	readonly isChecked?: boolean;
}
