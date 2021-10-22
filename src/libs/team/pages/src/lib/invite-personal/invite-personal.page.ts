import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { MemberService } from '../../../../services/src/lib/member.service';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SneatUserService } from '@sneat/user';
import {
	IAcceptPersonalInviteRequest,
	IMemberInfo,
	IPersonalInvite,
	IRejectPersonalInviteRequest,
} from '@sneat/team-models';
import { SneatTeamApiService } from '@sneat/api';
import { RandomIdService } from '@sneat/random';

@Component({
	selector: 'app-invite-personal',
	templateUrl: './invite-personal.page.html',
	styleUrls: ['./invite-personal.page.scss'],
})
export class InvitePersonalPage implements OnInit {
	public fullName: string;
	public email: string;
	public pin: string;

	public hidePin: boolean;

	public working: boolean;
	public accepting: boolean;
	public rejecting: boolean;

	public invite?: IPersonalInvite;
	public members?: IMemberInfo[];

	private inviteId: string;
	private teamId?: string;

	constructor(
		private readonly afAuth: AngularFireAuth,
		private readonly userService: SneatUserService,
		private readonly route: ActivatedRoute,
		private readonly sneatTeamApiService: SneatTeamApiService,
		private readonly memberService: MemberService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly randomIdService: RandomIdService
	) {
		this.getPinFromUrl();
	}

	public ngOnInit() {
		this.route.queryParamMap.subscribe((qp) => {
			this.inviteId = qp.get('id');
			this.teamId = qp.get('team');
			this.sneatTeamApiService
				.getAsAnonymous<{ invite?: IPersonalInvite; members?: IMemberInfo[] }>(
					'invites/personal',
					new HttpParams({
						fromObject: { invite: this.inviteId, team: this.teamId },
					})
				)
				.subscribe({
					next: (response) => {
						console.log('invite record:', response);
						this.invite = response.invite;
						this.members = response.members.filter(
							(m) => m.id !== response.invite.memberId
						);
						if (response.invite) {
							this.fullName = response.invite.to.title;
							if (response.invite.channel === 'email') {
								this.email = response.invite.address;
							}
						}
					},
					error: (err) =>
						this.errorLogger.logError(err, 'Failed to load invite:'),
				});
		});
	}

	public join(): void {
		this.accepting = true;
		this.working = true;

		const acceptInvite = (token?: string) => {
			const request: IAcceptPersonalInviteRequest = {
				team: this.teamId,
				invite: this.inviteId,
				pin: this.pin,
				email: this.email,
				fullName: this.fullName,
			};
			this.memberService.acceptPersonalInvite(request, token).subscribe(
				(/*memberInfo*/) => {
					console.log('Joined team');
					this.navController
						.navigateRoot('team', { queryParams: { id: this.teamId } })
						.catch((err) => {
							this.errorLogger.logError(
								err,
								'Failed to navigate to team page after successfully joining a team'
							);
						});
				},
				(error) => {
					this.errorLogger.logError(error, 'Failed to join team');
					this.accepting = false;
					this.working = false;
				}
			);
		};

		if (this.userService.currentUserId) {
			acceptInvite(undefined);
		} else {
			// Move into service?
			const password = this.randomIdService.newRandomId();
			this.afAuth
				.createUserWithEmailAndPassword(this.email, password)
				.then((userCredential) => {
					userCredential.user
						.getIdToken()
						.then((token) => {
							acceptInvite(token);
						})
						.catch((err) => {
							this.errorLogger.logError(err, 'Failed to get Firebase token');
						});
				})
				.catch((err) => {
					this.accepting = false;
					this.working = false;
					this.errorLogger.logError(err, 'Failed to create Firebase user');
				});
		}
	}

	public reject(): void {
		this.rejecting = true;
		this.working = true;
		const request: IRejectPersonalInviteRequest = {
			team: this.teamId,
			invite: this.inviteId,
			pin: this.pin,
		};
		this.memberService.rejectPersonalInvite(request).subscribe(
			() => {
				console.log('Refused to join team');
				this.navController.navigateRoot('teams').catch((err) => {
					this.errorLogger.logError(
						err,
						'Failed to navigate to teams page after successfully refused joining a team'
					);
				});
			},
			(error) => {
				this.errorLogger.logError(error, 'Failed to join team');
				this.working = false;
				this.rejecting = false;
			}
		);
	}

	private getPinFromUrl(): void {
		const m = location.hash.match(/[#&]pin=(\d+)($|&)/);
		if (m) {
			this.pin = m[1];
			this.hidePin = true;
		}
	}
}
