import {
	IIdAndBrief,
	IIdAndBriefAndDbo,
	IIdAndOptionalBriefAndOptionalDbo,
	IIdAndOptionalDbo,
} from '@sneat/core';
import { ISpaceRef } from './space-context';

export interface ISpaceItemWithOptionalBriefAndOptionalDbo<
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
> = ISpaceItemWithOptionalBriefAndOptionalDbo<Brief, Dbo>;

export interface ISpaceItemWithBriefAndDbo<Brief, Dbo extends Brief>
	extends IIdAndBriefAndDbo<Brief, Dbo> {
	readonly space: ISpaceRef;
}

export interface ISpaceItemBriefWithSpaceRef<Brief> extends IIdAndBrief<Brief> {
	readonly space: ISpaceRef;
}

export function spaceItemBriefWithSpaceRefFromBrief<Brief>(
	space: ISpaceRef,
	id: string,
	brief: Brief,
): ISpaceItemBriefWithSpaceRef<Brief> {
	return { id, brief, space };
}
