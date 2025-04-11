import { SpaceType } from './team-type';

export interface ISpaceRef {
	readonly id: string;
	readonly type?: SpaceType;
}

export function equalSpaceRefs(
	v1?: ISpaceRef | null,
	v2?: ISpaceRef | null,
): boolean {
	if (v1 === v2) return true;
	return v1?.id === v2?.id && v1?.type === v2?.type;
}

export const emptySpaceRef: ISpaceRef = { id: '' };

export interface IIdAndBrief<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

export interface IIdAndBriefWithSpaceRef<Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly space: ISpaceRef;
}

export interface IIdAndOptionalBrief<Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
}

export interface IIdAndOptionalDbo<Dbo> {
	readonly id: string;
	readonly dbo?: Dbo | null;
}

export interface IIdAndDbo<Dbo> {
	readonly id: string;
	readonly dbo: Dbo;
}

export interface IIdAndOptionalBriefAndOptionalDbo<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief?: Brief | null;
	readonly dbo?: Dbo | null;
}

export interface IIdAndBriefAndOptionalDbo<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dbo?: Dbo | null;
}

export interface IIdAndBriefAndDbo<Brief, Dbo extends Brief> {
	readonly id: string;
	readonly brief: Brief;
	readonly dbo: Dbo;
}

export interface ISpaceItemWithBriefAndDbo<Brief, Dbo extends Brief>
	extends IIdAndBriefAndDbo<Brief, Dbo> {
	readonly space: ISpaceRef;
}

export interface ISpaceItemBriefWithSpace<Brief> extends IIdAndBrief<Brief> {
	readonly space: ISpaceRef;
}

export function spaceItemBriefWithSpaceRefFromBrief<Brief>(
	space: ISpaceRef,
	id: string,
	brief: Brief,
): ISpaceItemBriefWithSpace<Brief> {
	return { id, brief, space };
}
