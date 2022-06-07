import { IMemberBrief } from '@sneat/dto';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { Observable } from 'rxjs';

export interface ISelectMembersOptions {
	// readonly team?: ITeamContext;
	readonly members?: readonly IMemberContext[];
	readonly selectedMembers?: readonly IMemberContext[];
	readonly max?: number;
	readonly onAdded?: (teamID: string, memberID: string) => Observable<void>;
	readonly onRemoved?: (teamID: string, memberID: string) => Observable<void>;
}
