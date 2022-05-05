import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { IErrorResponse } from '@sneat/core';
import { IMemberBrief, IMemberDto } from '@sneat/dto';
import {
	IAcceptPersonalInviteRequest,
	ICreateTeamMemberRequest,
	IAddTeamMemberResponse,
	IMemberContext,
	IRejectPersonalInviteRequest,
	ITeamContext, ITeamRef,
} from '@sneat/team/models';
import { Observable, throwError } from 'rxjs';
import { map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { TeamService } from './team.service';

export const memberBriefFromDto = (id: string, dto: IMemberDto): IMemberBrief => ({ id, ...dto });
export const memberContextFromBrief = (brief: IMemberBrief): IMemberContext => ({ id: brief.id, brief });

@Injectable({
	providedIn: 'root',
})
export class MemberService {
	private readonly sfs: SneatFirestoreService<IMemberBrief, IMemberDto>;

	constructor(
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

	public addMember(request: ICreateTeamMemberRequest): Observable<IMemberBrief> {
		console.log(`MemberService.addMember()`, request);
		const fullName = request.name.full || '';
		if (!fullName) {
			return throwError(() => new Error('full name is required'));
		}
		const processAddMemberResponse = (
			response: IAddTeamMemberResponse | IErrorResponse,
		) => {
			if ((response as { error?: any }).error) {
				throw (response as IErrorResponse).error;
			}
			const okResponse = response as IAddTeamMemberResponse;
			let member: IMemberBrief = {
				id: okResponse.id,
				title: fullName,
				roles: [request.role],
			};
			if (okResponse.uid) {
				member = { ...member, uid: okResponse.uid };
			}
			return this.teamService.getTeam({id: request.teamID}).pipe(
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
		team: ITeamRef,
		memberId: string,
	): Observable<{ team: ITeamContext; member?: IMemberDto } | undefined | null> {
		const findMember = (team: ITeamContext) => team ? {
			team,
			member: team?.dto?.members?.find(m => m.id === memberId),
		} : team === null ? null : undefined;
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
