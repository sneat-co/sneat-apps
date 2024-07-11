import { SpaceType } from '@sneat/core';

export interface ISpaceBrief {
	readonly title: string;
	readonly type: SpaceType;
	readonly parentTeamID?: string;
	readonly roles?: string[];
}

export const equalTeamBriefs = (
	v1?: ISpaceBrief | null,
	v2?: ISpaceBrief | null,
): boolean => {
	if (v1 === v2) return true;
	return v1?.parentTeamID === v2?.parentTeamID && v1?.title === v2?.title;
};

export const isTeamSupportsMemberGroups = (t: SpaceType): boolean => {
	return t === 'educator' || t === 'sport_club' || t === 'cohabit';
};
