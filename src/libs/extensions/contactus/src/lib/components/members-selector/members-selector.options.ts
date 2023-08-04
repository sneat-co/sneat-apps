import { IMemberContext } from '@sneat/team/models';
import { Observable } from 'rxjs';

export interface ISelectMembersOptions {
	// readonly team?: ITeamContext;
	readonly members?: readonly IMemberContext[];
	readonly selectedMembers?: readonly IMemberContext[];
	readonly max?: number;
	readonly onAdded?: (member: IMemberContext) => Observable<void>;
	readonly onRemoved?: (member: IMemberContext) => Observable<void>;
}
