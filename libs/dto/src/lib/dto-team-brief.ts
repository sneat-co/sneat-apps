import { TeamType } from '@sneat/core';

export interface ITeamBrief {
	readonly title: string;
	readonly type: TeamType;
	readonly parentTeamID?: string;
	readonly roles?: string[];
}

export const equalTeamBriefs = (
	v1?: ITeamBrief | null,
	v2?: ITeamBrief | null,
): boolean => {
	if (v1 === v2) return true;
	return v1?.parentTeamID === v2?.parentTeamID && v1?.title === v2?.title;
};

export const isTeamSupportsMemberGroups = (t: TeamType): boolean => {
	return t === 'educator' || t === 'sport_club' || t === 'cohabit';
};
