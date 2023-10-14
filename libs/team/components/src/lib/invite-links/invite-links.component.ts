import { Component, Inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactusTeamDtoWithID } from '@sneat/team/models';
import { TeamNavService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth-core';
import { Subscription } from 'rxjs';

export const stringHash = (s: string): number => {
	let hash = 0;
	if (!s.length) {
		return hash;
	}
	for (let i = 0; i < s.length; i++) {
		const char = s.charCodeAt(i);
		// eslint-disable-next-line no-bitwise
		hash = (hash << 5) - hash + char;
		// eslint-disable-next-line no-bitwise
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

@Component({
	selector: 'sneat-invite-links',
	templateUrl: './invite-links.component.html',
	styleUrls: ['./invite-links.component.scss'],
})
export class InviteLinksComponent implements OnChanges, OnDestroy {
	@Input() public contactusTeam?: IContactusTeamDtoWithID;

	public inviteUrlsFor?: {
		contributors: string;
		spectators: string;
	};

	private currentUserId?: string;
	private readonly subscription: Subscription;

	constructor(
		readonly userService: SneatUserService,
		private readonly navService: TeamNavService,
		private readonly navController: NavController,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
		this.subscription = userService.userChanged.subscribe((uid) => {
			this.currentUserId = uid;
			this.setPins();
		});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	ngOnChanges() {
		this.setPins();
	}

	goNewMember(event?: Event): void {
		console.log('TeamPage.goNewMember()');
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		const team = this.contactusTeam;
		if (!team?.id) {
			this.errorLogger.logError(
				'Not able to navigate to team member is teamId is now known',
			);
			return;
		}
		this.navService.navigateToAddMember(this.navController, team);
	}

	copy(s: string): void {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(s)
				.catch((err) =>
					this.errorLogger.logError(
						err,
						'Failed to copy invite URL to clipboard',
					),
				);
		}
	}

	private setPins(): void {
		const uid = this.currentUserId;
		if (!uid) {
			this.inviteUrlsFor = undefined;
			return;
		}
		const teamId = this.contactusTeam?.id;
		const getPin = (role: 'contributor' | 'spectator'): number =>
			Math.abs(stringHash(`${teamId}-${role}-${uid}`));
		const url = `${document.baseURI}join-team?id=${teamId}#pin=`;
		this.inviteUrlsFor = {
			contributors: url + getPin('contributor'),
			spectators: url + getPin('spectator'),
		};
	}
}
