import { Component, inject, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonIcon,
	IonLabel,
	IonSkeletonText,
	NavController,
} from '@ionic/angular/standalone';
import { ContactusNavService } from '@sneat/contactus-services';
import { IIdAndOptionalDbo } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { Subscription } from 'rxjs';

export const stringHash = (s: string): number => {
	let hash = 0;
	if (!s.length) {
		return hash;
	}
	for (let i = 0; i < s.length; i++) {
		const char = s.charCodeAt(i);

		hash = (hash << 5) - hash + char;

		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

@Component({
	selector: 'sneat-invite-links',
	templateUrl: './invite-links.component.html',
	styleUrls: ['./invite-links.component.scss'],
	imports: [FormsModule, IonSkeletonText, IonButton, IonIcon, IonLabel],
})
export class InviteLinksComponent implements OnChanges, OnDestroy {
	readonly userService = inject(SneatUserService);
	private readonly navService = inject(SpaceNavService);
	private readonly navController = inject(NavController);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	@Input() public contactusSpace?: IIdAndOptionalDbo<IContactusSpaceDbo>;

	public inviteUrlsFor?: {
		contributors: string;
		spectators: string;
	};

	private currentUserId?: string;
	private readonly subscription: Subscription;

	private readonly contactusNavService = inject(ContactusNavService);

	constructor() {
		const userService = this.userService;

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
		console.log('InviteLinksComponent.goNewMember()');
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}
		const space = this.contactusSpace;
		if (!space?.id) {
			this.errorLogger.logError(
				'Not able to navigate to space member is spaceId is now known',
			);
			return;
		}
		this.contactusNavService
			.navigateToAddMember({ id: space.id })
			.catch(
				this.errorLogger.logErrorHandler('Failed to navigate to add member'),
			);
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
		const spaceID = this.contactusSpace?.id;
		const getPin = (role: 'contributor' | 'spectator'): number =>
			Math.abs(stringHash(`${spaceID}-${role}-${uid}`));
		const url = `${document.baseURI}join-space?id=${spaceID}#pin=`;
		this.inviteUrlsFor = {
			contributors: url + getPin('contributor'),
			spectators: url + getPin('spectator'),
		};
	}
}
