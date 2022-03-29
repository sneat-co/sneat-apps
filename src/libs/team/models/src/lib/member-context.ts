import { IMember, IMemberInfo } from './models';
import { ITeamItemContext } from './team-item-context';

export type IMemberContext = ITeamItemContext<IMemberInfo, IMember>;
