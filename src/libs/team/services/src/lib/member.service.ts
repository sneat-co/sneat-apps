import { Injectable } from '@angular/core';
import { IMemberBrief, IMemberDto, ITeamDto } from '@sneat/dto';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { SneatApiService } from '@sneat/api';
import {
	IAcceptPersonalInviteRequest,
	IAddTeamMemberRequest,
	IAddTeamMemberResponse,
	IRejectPersonalInviteRequest, ITeamContext,
} from '@sneat/team/models';
import { TeamService } from './team.service';
import { IErrorResponse } from '@sneat/core';

@Injectable({
	providedIn: 'root',
})
export class MemberService {
	constructor(
		private readonly db: AngularFirestore,
		private readonly teamService: TeamService,
		private readonly sneatApiService: SneatApiService,
	) {
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

	public addMember(request: IAddTeamMemberRequest): Observable<IMemberBrief> {
		console.log(`MemberService.addMember()`, request);
		const processAddMemberResponse = (
			response: IAddTeamMemberResponse | IErrorResponse,
		) => {
			if ((response as { error?: any }).error) {
				throw (response as IErrorResponse).error;
			}
			const okResponse = response as IAddTeamMemberResponse;
			let member: IMemberBrief = {
				id: okResponse.id,
				title: request.title,
				roles: [request.role],
			};
			if (okResponse.uid) {
				member = {...member, uid: okResponse.uid};
			}
			return this.teamService.getTeam(request.teamID).pipe(
				tap((team) => {
					if (team) {
						team?.dto?.members.push(member);
					}
					this.teamService.onTeamUpdated(team);
				}),
				mapTo(member),
			);
		};
		return this.sneatApiService
			.post<IAddTeamMemberResponse>('team/add_member', request)
			.pipe(mergeMap(processAddMemberResponse));
	}

	public watchMember(
		teamId: string,
		memberId: string,
	): Observable<{ team: ITeamContext; member?: IMemberDto } | undefined | null> {
		const findMember = (team: ITeamContext) => team ? {
			team,
			member: team?.dto?.members?.find(m => m.id === memberId),
		} : team === null ? null : undefined;
		return this.teamService.watchTeam(teamId)
			.pipe(
				map(findMember),
			);
	}
}
