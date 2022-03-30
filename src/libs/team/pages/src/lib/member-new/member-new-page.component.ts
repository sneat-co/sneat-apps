import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonInput, NavController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAddTeamMemberRequest, ITeamDto } from '@sneat/team/models';
import { IUserTeamInfo } from '@sneat/auth-models';
import { IRecord } from '@sneat/data';
import { MemberService, TeamService } from '@sneat/team/services';

@Component({
	selector: 'sneat-member-new',
	templateUrl: './member-new-page.component.html',
})
export class MemberNewPageComponent {
	@ViewChild('titleInput', { static: false }) titleInput?: IonInput; // TODO: strong typing : IonInput;

	public tab: 'personal' | 'mass' = 'mass';
	public teamId?: string;
	public team?: ITeamDto;
	public teamInfo?: IUserTeamInfo;
	public title = new FormControl('', [
		Validators.required,
		Validators.maxLength(50),
	]);
	public role = new FormControl('contributor', [Validators.required]);

	// public role: 'contributor' | 'spectator' = 'contributor';
	public email = new FormControl('', [Validators.required, Validators.email]);
	public message = new FormControl('', [Validators.maxLength(300)]);
	public addMemberForm = new FormGroup({
		title: this.title,
		email: this.email,
		message: this.message,
	});

	constructor(
		readonly route: ActivatedRoute,
		readonly teamService: TeamService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly memberService: MemberService,
	) {
		console.log('MemberNewPage.constructor()');
		try {
			const teamRecord = window.history.state.team as IRecord<ITeamDto>;
			if (teamRecord) {
				this.teamId = teamRecord.id;
				this.setTeam(teamRecord.dto);
			} else {
				route.queryParamMap.subscribe((queryParams) => {
					const teamId = (this.teamId = queryParams.get('team') || undefined);
					if (teamId) {
						teamService.getTeam(teamId).subscribe(
							(team) => {
								if (teamId === this.teamId) {
									this.setTeam(team || undefined);
								}
							},
							err => this.errorLogger.logError(err, 'Failed to get team'),
						);
					}
				});
			}
		} catch (e) {
			this.errorLogger.logError(
				e,
				'MemberNewPage.constructor(): unhandled error',
			);
		}
	}

	public get defaultBackUrl(): string {
		return this.teamId ? `/team?id=${this.teamId}` : '/home';
	}

	public ionViewDidEnter(): void {
		if (this.tab === 'personal') {
			this.setFocusToTitleInput();
		}
	}

	public tabChanged(): void {
		if (this.tab === 'personal') {
			this.setFocusToTitleInput(100);
		}
	}

	public addMember(): void {
		console.log('NewMemberFormComponent.addMember()');
		if (!this.teamId) {
			throw 'teamId is not set';
		}
		if (!this.addMemberForm.valid) {
			setTimeout(() => {
				alert('Form is not valid:' + JSON.stringify(this.addMemberForm.errors));
			});
			return;
		}
		this.addMemberForm.disable();
		const title = (this.title.value as string).trim();
		const request: IAddTeamMemberRequest = {
			team: this.teamId,
			role: this.role.value,
			gender: 'unknown',
			ageGroup: 'unknown',
			title,
		};
		const email = (this.email.value as string).trim();
		if (email) {
			request.email = email;
		}
		const message = (this.message.value as string).trim();
		if (message) {
			request.message = message;
		}
		this.memberService.addMember(request).subscribe(
			(/*createdMemberInfo*/) => {
				this.navController
					.pop()
					.catch((err) =>
						this.errorLogger.logError(err, 'Failed to pop navigator state'),
					);
			},
			(err) => {
				this.errorLogger.logError(err, 'Failed to add member');
				this.addMemberForm.enable();
			},
		);
	}

	private setTeam(team: ITeamDto | undefined): void {
		this.team = team;
		if (this.teamId) {
			this.teamInfo = { id: this.teamId, title: team?.title || 'loading...', type: team?.type || 'unknown' };
		}
	}

	private setFocusToTitleInput(delay = 1): void {
		console.log('setFocusToTitleInput');
		setTimeout(() => {
			const errMsg = 'Failed to set focus to title input',
				errOpts = { feedback: false };
			if (this.titleInput) {
				this.titleInput
					.setFocus()
					.catch((err) => this.errorLogger.logError(err, errMsg, errOpts));
			} else {
				this.errorLogger.logError('this.titleInput not found', errMsg, errOpts);
			}
		}, delay);
	}
}
