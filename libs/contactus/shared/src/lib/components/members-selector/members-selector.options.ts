import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { Observable } from 'rxjs';

export interface ISelectMembersOptions {
	// readonly team?: ITeamContext;
	readonly members?: readonly IIdAndBrief<IContactBrief>[];
	readonly selectedMembers?: readonly IIdAndBrief<IContactBrief>[];
	readonly max?: number;
	readonly onAdded?: (member: IIdAndBrief<IContactBrief>) => Observable<void>;
	readonly onRemoved?: (member: IIdAndBrief<IContactBrief>) => Observable<void>;
}
