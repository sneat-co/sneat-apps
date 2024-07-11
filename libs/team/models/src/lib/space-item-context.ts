import {
	IIdAndBrief,
	IIdAndBriefAndDto,
	IIdAndOptionalBriefAndOptionalDbo,
	IIdAndOptionalDbo,
} from '@sneat/core';
import { ISpaceRef } from './space-context';

export interface ISpaceItemWithOptionalBriefAndOptionalDto<
	Brief,
	Dbo extends Brief,
> extends IIdAndOptionalBriefAndOptionalDbo<Brief, Dbo> {
	readonly space: ISpaceRef;
}

export interface ISpaceItemWithOptionalDbo<Dbo> extends IIdAndOptionalDbo<Dbo> {
	readonly space: ISpaceRef;
}

export type ISpaceItemNavContext<
	Brief,
	Dbo extends Brief,
> = ISpaceItemWithOptionalBriefAndOptionalDto<Brief, Dbo>;

export interface ISpaceItemWithBriefAndDbo<Brief, Dbo extends Brief>
	extends IIdAndBriefAndDto<Brief, Dbo> {
	readonly space: ISpaceRef;
}

export interface ISpaceItemBriefWithSpaceRef<Brief> extends IIdAndBrief<Brief> {
	readonly space: ISpaceRef;
}

export function spaceItemBriefWithTeamRefFromBrief<Brief>(
	space: ISpaceRef,
	id: string,
	brief: Brief,
): ISpaceItemBriefWithSpaceRef<Brief> {
	return { id, brief, space };
}
