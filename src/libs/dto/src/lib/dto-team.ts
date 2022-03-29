import { IBrief } from './dto-brief';
import { TeamType } from './types';

export interface IUserTeamBrief extends IBrief {
	readonly type: TeamType;
	readonly parentTeamID?: string;
	readonly roles?: string[];
}
