import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IErrorResponse } from '@sneat/core';
import { IMemberBrief, IMemberDto } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAcceptPersonalInviteRequest,
	IAddTeamMemberResponse,
	ICreateTeamMemberRequest,
	IMemberContext,
	IRejectPersonalInviteRequest,
	ITeamContext,
	ITeamRef,
} from '@sneat/team/models';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { TeamService } from './team.service';

export const memberBriefFromDto = (id: string, dto: IMemberDto): IMemberBrief => ({ id, ...dto });
export const memberContextFromBrief = (brief: IMemberBrief): IMemberContext => ({ id: brief.id, brief });

@Injectable({
	providedIn: 'root',
})
export class MemberService {
	private readonly sfs: SneatFirestoreService<IMemberBrief, IMemberDto>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		private readonly teamService: TeamService,
		private readonly sneatApiService: SneatApiService,
	) {
		this.sfs = new SneatFirestoreService<IMemberBrief, IMemberDto>('team_members', afs, memberBriefFromDto);
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

	public rejectPersonalInvite(
		request: IRejectPersonalInviteRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'invites/reject_personal_invite',
			request,
		);
	}

	public createMember(request: ICreateTeamMemberRequest): Observable<IMemberContext> {
		console.log(`MemberService.addMember()`, request);
		const processAddMemberResponse = (
			response: IAddTeamMemberResponse | IErrorResponse,
		) => {
			if ((response as { error?: any }).error) {
				throw (response as IErrorResponse).error;
			}
			const okResponse = response as IAddTeamMemberResponse;
			if (!okResponse.member) {
				this.errorLogger.logError('okResponse.member is undefined', undefined, {show: false});
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
							team = {...team, dto: {...team.dto, members}};
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
	): Observable<{ team: ITeamContext; member?: IMemberContext | null } | undefined | null> {
		const findMember = (team: ITeamContext) => {
			if (team) {
				const memberBrief = team?.dto?.members?.find(m => m.id === memberId);
				if (!memberBrief) {
					return {team, member: null};
				}
				const member: IMemberContext = {id: memberBrief.id, brief: memberBrief};
				return {
					team,
					member,
				};
			} else if (team == null) {
				return null
			} else {
				return undefined;
			}
		};
		return this.teamService.watchTeam(team)
			.pipe(
				map(findMember),
			);
	}

	watchMembersByTeamID<IMemberDto>(teamID: string): Observable<IMemberContext[]> {
		console.log('MemberService.watchMembersByTeamID()', teamID);
		return this.sfs.watchByTeamID(teamID, 'teamID');
	}
}
