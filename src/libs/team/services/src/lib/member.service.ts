import { Inject, Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IErrorResponse } from '@sneat/core';
import { IMemberBrief, IMemberDto, trimNames } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAcceptPersonalInviteRequest,
	IAddTeamMemberResponse,
	ICreateTeamMemberRequest,
	IMemberContext,
	ITeamContext,
	ITeamRef,
} from '@sneat/team/models';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { TeamItemService } from './team-item.service';
import { TeamService } from './team.service';

// export const memberBriefFromDto = (id: string, dto: IMemberDto): IMemberBrief => ({ id, ...dto });
export const memberContextFromBrief = (brief: IMemberBrief, team: ITeamContext): IMemberContext => ({
	id: brief.id,
	brief,
	team,
});


@Injectable({
	providedIn: 'root',
})
export class MemberService {
	private readonly teamItemService: TeamItemService<IMemberBrief, IMemberDto>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		private readonly teamService: TeamService,
		private readonly sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService<IMemberBrief, IMemberDto>('members', afs, sneatApiService);
	}

	public acceptPersonalInvite(
		request: IAcceptPersonalInviteRequest,
		firebaseToken: string,
	): Observable<IMemberBrief> {
		console.log('MemberService.acceptPersonalInvite()');
		if (firebaseToken) {
			this.sneatApiService.setApiAuthToken(firebaseToken);
		}
		return this.sneatApiService.post(
			'invites/accept_personal_invite',
			request,
		);
	}

	public createMember(request: ICreateTeamMemberRequest): Observable<IMemberContext> {
		console.log(`MemberService.addMember()`, request);
		if (request.name) {
			request = { ...request, name: trimNames(request.name) };
		}
		const processAddMemberResponse = (
			response: IAddTeamMemberResponse | IErrorResponse,
		) => {
			if ((response as { error?: unknown }).error) {
				throw (response as IErrorResponse).error;
			}
			const okResponse = response as IAddTeamMemberResponse;
			if (!okResponse.member) {
				this.errorLogger.logError('okResponse.member is undefined', undefined, { show: false });
			}
			const member = okResponse.member;
			return this.teamService.getTeam({ id: request.teamID }).pipe(
				tap((team) => {
					if (team?.dto) {
						const members: IMemberBrief[] = team.dto.members ? [...team.dto.members] : [];
						if (!member.brief) {
							throw new Error('!member.brief');
						}
						if (!members.some(m => m.id === member.id)) {
							members.push(member.brief);
							team = { ...team, dto: { ...team.dto, members } };
							this.teamService.onTeamUpdated(team);
						}
					}
				}),
				map(() => member),
			);
		};
		return this.sneatApiService
			.post<IAddTeamMemberResponse>('members/create_member', request)
			.pipe(mergeMap(processAddMemberResponse));
	}

	public watchMember(
		team: ITeamRef,
		memberId: string,
	): Observable<IMemberContext> {
		const findMember = (team: ITeamContext) => {
			let member: IMemberContext;
			const memberBrief = team?.dto?.members?.find(m => m.id === memberId);
			if (!memberBrief) {
				member = { team, id: memberId, brief: null, dto: null };
			} else {
				member = { team, id: memberBrief.id, brief: memberBrief };
			}
			return member;
		};
		return this.teamService.watchTeam(team)
			.pipe(
				map(findMember),
			);
	}

	watchTeamMembers(team: ITeamContext, status: 'active' | 'archived' = 'active'): Observable<IMemberContext[]> {
		console.log('MemberService.watchMembersByTeamID()', team.id);
		return this.teamItemService.watchTeamItems(team, [{ field: 'status', operator: '==', value: status }]);
	}
}
