import { IContactContext, IMemberContext } from '@sneat/team/models';
import { Observable } from 'rxjs';

export interface ISelectMembersOptions {
	// readonly team?: ITeamContext;
	readonly members?: readonly IContactContext[];
	readonly selectedMembers?: readonly IContactContext[];
	readonly max?: number;
	readonly onAdded?: (member: IContactContext) => Observable<void>;
	readonly onRemoved?: (member: IContactContext) => Observable<void>;
}
