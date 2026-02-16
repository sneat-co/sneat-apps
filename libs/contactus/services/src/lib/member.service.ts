import { Injectable } from '@angular/core';
import { trimNames } from '@sneat/auth-models';
import {
  IMemberBrief,
  IAcceptPersonalInviteRequest,
  IAddSpaceMemberResponse,
  ICreateSpaceMemberRequest,
  validateCreateSpaceMemberRequest,
} from '@sneat/contactus-core';
import { ContactService } from './contact-service';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService extends ContactService {
  public acceptPersonalInvite(
    request: IAcceptPersonalInviteRequest,
    firebaseToken: string,
  ): Observable<IMemberBrief> {
    // console.log('MemberService.acceptPersonalInvite()');
    if (firebaseToken) {
      this.sneatApiService.setApiAuthToken(firebaseToken);
    }
    return this.sneatApiService.post('invites/accept_personal_invite', request);
  }

  public createMember(
    request: ICreateSpaceMemberRequest,
  ): Observable<IAddSpaceMemberResponse> {
    // console.log(`MemberService.addMember()`, request);
    if (request.names) {
      request = { ...request, names: trimNames(request.names) };
    }
    validateCreateSpaceMemberRequest(request);
    return this.sneatApiService.post<IAddSpaceMemberResponse>(
      'contactus/create_member',
      request,
    );
  }
}
