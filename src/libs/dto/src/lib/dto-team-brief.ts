import { TeamType } from '@sneat/auth-models';
import { IWithIdAndTitle } from './dto-brief';

export interface ITeamBrief extends IWithIdAndTitle {
	readonly type: TeamType;
	readonly parentTeamID?: string;
	readonly roles?: string[];
}

export const equalTeamBriefs = (v1?: ITeamBrief | null, v2?: ITeamBrief | null): boolean => {
	if (v1 === v2)
		return true;
	if (v1?.id === v2?.id && v1?.type === v2?.type && v1?.parentTeamID === v2?.parentTeamID && v1?.title === v2?.title)
		return true;
	return false;
};
