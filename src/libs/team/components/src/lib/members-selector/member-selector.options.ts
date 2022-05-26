import { IMemberBrief } from '@sneat/dto';
import { Observable } from 'rxjs';

export interface ISelectMembersOptions {
	readonly teamIDs: readonly string[];
	readonly members?: readonly IMemberBrief[];
	readonly selectedMemberIDs?: readonly string[];
	readonly max?: number;
	readonly onAdded?: (teamID: string, memberID: string) => Observable<void>;
	readonly onRemoved?: (teamID: string, memberID: string) => Observable<void>;
}
