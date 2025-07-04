import { Injectable, inject } from '@angular/core';
import {
	Auth as AngularFireAuth,
	createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import {
	IAcceptPersonalInviteRequest,
	ICreatePersonalInviteRequest,
	ICreatePersonalInviteResponse,
	IJoinSpaceInfoResponse,
} from '@sneat/contactus-core';
import { excludeEmpty } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { RandomIdService } from '@sneat/random';
import {
	IAcceptInviteResponse,
	IRejectPersonalInviteRequest,
} from '@sneat/space-models';
import { from, Observable, switchMap, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class InviteService {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly sneatAuthService = inject(SneatAuthStateService);
	private readonly sneatApiService = inject(SneatApiService);
	private readonly afAuth = inject(AngularFireAuth);
	private readonly randomService = inject(RandomIdService);

	public createInviteForMember(
		request: ICreatePersonalInviteRequest,
	): Observable<ICreatePersonalInviteResponse> {
		return this.sneatApiService.post<ICreatePersonalInviteResponse>(
			'invites/create_invite_for_member',
			excludeEmpty(request),
		);
	}

	public getInviteLinkForMember(
		request: ICreatePersonalInviteRequest,
	): Observable<ICreatePersonalInviteResponse> {
		// TODO: Should we pass `request.message`? If not should be excluded from request
		return this.sneatApiService.get<ICreatePersonalInviteResponse>(
			`invites/invite_link_for_member?space=${request.spaceID}&member=${request.to.memberID}`,
		);
	}

	public getSpaceJoinInfo(
		inviteID: string,
		pin: string,
	): Observable<IJoinSpaceInfoResponse> {
		return this.sneatApiService
			.postAsAnonymous<IJoinSpaceInfoResponse>('space/join_info', {
				inviteID,
				pin,
			})
			.pipe(
				map((response) => ({
					...response,
					invite: {
						...response.invite,
						id: inviteID,
						pin,
					},
				})),
			);
	}

	public rejectPersonalInvite(
		request: IRejectPersonalInviteRequest,
	): Observable<void> {
		return this.sneatApiService.post('invites/reject_personal_invite', request);
	}

	public acceptInviteByAuthenticatedUser(
		inviteInfo: IJoinSpaceInfoResponse,
	): Observable<IAcceptInviteResponse> {
		const request: IAcceptPersonalInviteRequest = {
			spaceID: inviteInfo.space.id,
			inviteID: inviteInfo.invite.id,
			pin: inviteInfo.invite.pin,
			member: inviteInfo.member,
			// email: this.email,
			// fullName: this.fullName,
		};
		return this.sneatApiService.post('invites/accept_personal_invite', request);
	}

	public acceptInviteByUnauthenticatedUser(
		inviteInfo: IJoinSpaceInfoResponse,
	): Observable<IAcceptInviteResponse> {
		if (
			inviteInfo.invite.to.channel === 'email' &&
			inviteInfo.invite.to.address
		) {
			return this.acceptEmailInviteByUnauthenticatedUser(inviteInfo);
		}
		return throwError(
			() => 'Only join from an email invites is implemented yet',
		);
	}

	private acceptEmailInviteByUnauthenticatedUser(
		inviteInfo: IJoinSpaceInfoResponse,
	): Observable<IAcceptInviteResponse> {
		const email = inviteInfo.invite.to.address;
		if (!email) {
			return throwError(() => 'No value in inviteInfo.invite.to.address');
		}
		const password = this.randomService.newRandomId({ len: 12 });
		const credentialPromise = createUserWithEmailAndPassword(
			this.afAuth,
			email,
			password,
		);
		const credentialObserver = from(credentialPromise);
		return credentialObserver.pipe(
			switchMap((userCredential) => {
				if (!userCredential.user) {
					throw new Error('!userCredential.user');
				}
				// We call it to be 100% sure user fully authenticated
				return from(userCredential.user.getIdToken());
			}),
			switchMap((firebaseToken) => {
				this.sneatApiService.setApiAuthToken(firebaseToken);
				return this.acceptInviteByAuthenticatedUser(inviteInfo);
			}),
		);
	}
}
