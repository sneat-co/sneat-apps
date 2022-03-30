import { IMemberBrief, IMemberDto } from '@sneat/dto';
import { ITeamItemContext } from './team-item-context';

export type IMemberContext = ITeamItemContext<IMemberBrief, IMemberDto>;
