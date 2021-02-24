import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, mapTo, mergeMap, tap} from 'rxjs/operators';
import {SneatTeamApiService} from '@sneat/api';
import {
  IAcceptPersonalInviteRequest,
  IAddTeamMemberRequest,
  IMember,
  IMemberInfo,
  IRejectPersonalInviteRequest,
  ITeam
} from '@sneat/team';
import {IAddTeamMemberResponse, IErrorResponse} from '@sneat/datatug/models';
import {TeamService} from './team.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(
    private readonly db: AngularFirestore,
    private readonly teamService: TeamService,
    private readonly sneatTeamApiService: SneatTeamApiService,
  ) {
  }

  public acceptPersonalInvite(request: IAcceptPersonalInviteRequest, firebaseToken: string): Observable<IMemberInfo> {
    console.log('MemberService.acceptPersonalInvite()');
    if (firebaseToken) {
      this.sneatTeamApiService.setFirebaseToken(firebaseToken);
    }
    return this.sneatTeamApiService.post('invites/accept_personal_invite', request);
  }

  public rejectPersonalInvite(request: IRejectPersonalInviteRequest): Observable<void> {
    return this.sneatTeamApiService.post('invites/reject_personal_invite', request);
  }

  public addMember(request: IAddTeamMemberRequest): Observable<IMemberInfo> {
    console.log(`MemberService.addMember()`, request);
    const processAddMemberResponse = (response: IAddTeamMemberResponse | IErrorResponse) => {
      if (response.hasOwnProperty('error')) {
        throw (response as IErrorResponse).error;
      }
      const okResponse = response as IAddTeamMemberResponse;
      const member: IMemberInfo = {
        id: okResponse.id,
        title: request.title,
        roles: [request.role],
      };
      if (okResponse.uid) {
        member.uid = okResponse.uid;
      }
      return this.teamService.getTeam(request.team).pipe(
        tap(team => {
          team.members.push(member);
          this.teamService.onTeamUpdated({id: request.team, data: team});
        }),
        mapTo(member),
      );
    };
    return this.sneatTeamApiService
      .post<IAddTeamMemberResponse>('team/add_member', request)
      .pipe(mergeMap(processAddMemberResponse));
  }

  public watchMember(teamId: string, memberId: string): Observable<{ team: ITeam, member: IMember }> {
    const findMember = (team: ITeam) => ({team, member: team.members.find(m => m.id === memberId)});
    return this.teamService
      .watchTeam(teamId)
      .pipe(map(findMember));
  }
}
