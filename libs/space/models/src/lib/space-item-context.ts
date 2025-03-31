import {
	IIdAndOptionalBriefAndOptionalDbo,
	IIdAndOptionalDbo,
	ISpaceRef,
} from '@sneat/core';

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
