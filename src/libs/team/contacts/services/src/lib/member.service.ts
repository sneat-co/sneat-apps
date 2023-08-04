import { Inject, Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IErrorResponse } from '@sneat/core';
import { IMemberBrief, RoleTeamMember, trimNames } from '@sneat/dto';
import { TeamService } from '@sneat/team/services';
import { ContactService } from './contact-service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAcceptPersonalInviteRequest,
	IAddTeamMemberResponse, IBriefAndID,
	ICreateTeamMemberRequest,
	IMemberContext,
	ITeamContext,
	ITeamRef,
} from '@sneat/team/models';
import { Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { ContactusTeamService } from './contactus-team.service';

// export const memberBriefFromDto = (id: string, dto: IMemberDto): IMemberBrief => ({ id, ...dto });
export const memberContextFromBrief = (member: IBriefAndID<IMemberBrief>, team: ITeamContext): IMemberContext => ({
	...member,
	team,
});


@Injectable({
	providedIn: 'root',
})
export class MemberService extends ContactService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		afs: AngularFirestore,
		contactusTeamService: ContactusTeamService,
		sneatApiService: SneatApiService,
		private readonly teamService: TeamService,
	) {
		super(afs, sneatApiService, contactusTeamService);
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
				member = { team, id: memberId, brief: undefined, dto: null };
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
		return this.teamItemService.watchTeamItems(team, [
			{ field: 'status', operator: '==', value: status },
			{ field: 'roles', operator: '==', value: RoleTeamMember },
		]).pipe(map(items => items as IMemberContext[]));
	}
}
