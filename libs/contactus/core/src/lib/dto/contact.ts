import {
	IIdAndBrief,
	IIdAndBriefAndDbo,
	IIdAndBriefAndOptionalDbo,
	ISpaceItemBriefWithSpace,
	ISpaceItemWithBriefAndDbo,
} from '@sneat/core';
import { ISpaceModuleItemRef, IWithRelatedAndRelatedIDs } from '@sneat/dto';
import { ISpaceRef } from '@sneat/core';
import { IContactBase } from './contact-base';
import { IContact2Asset } from './contact2item';
import { IPersonRecord } from './person';

export interface IRelatedRolesRequest {
	readonly rolesOfItem?: string[];
	readonly rolesToItem?: string[];
}

export interface IRelatedToRequest {
	readonly itemRef: ISpaceModuleItemRef;
	readonly add?: IRelatedRolesRequest;
	readonly remove?: IRelatedRolesRequest;
}

// // Default value: 'optional'
export type RequirementOption = 'required' | 'optional' | 'excluded';

export interface IContactBrief extends IContactBase {
	readonly parentID?: string;
}

export type IContactWithBrief = IIdAndBrief<IContactBrief>;

export interface IContactWithSpace extends IContactWithBrief {
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
		IContactWithSpace {}

export interface IContactWithOptionalDboAndSpace
	extends IContactWithOptionalDbo,
		IContactWithSpace {}

export interface IContactWithCheck extends IContactWithOptionalDboAndSpace {
	readonly isChecked?: boolean;
}
