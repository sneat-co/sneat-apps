import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import {
	AuthStatus,
	AuthStatuses,
	SneatAuthStateService,
} from '@sneat/auth-core';
import {
	INamesFormFields,
	IPersonFormWizardFields,
	PersonWizardComponent,
} from '@sneat/contactus-shared';
import {
	IJoinSpaceInfoResponse,
	ContactIdAndDboWithSpaceRef,
	NewContactBaseDboAndSpaceRef,
} from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-services';
import {
	IRejectPersonalInviteRequest,
	ISpaceContext,
} from '@sneat/space-models';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { takeUntil } from 'rxjs/operators';
import { InviteService } from '@sneat/contactus-services';

export const getPinFromUrl: () => string = () => {
	const m = location.hash.match(/[#&]pin=(\d+)($|&)/);
	return (m && m[1]) || '';
};

@Component({
	imports: [
		FormsModule,
		PersonWizardComponent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonCard,
		IonCardContent,
		IonItemDivider,
		IonIcon,
		IonLabel,
		IonItem,
		IonInput,
		IonCardHeader,
		IonCardTitle,
		IonButton,
		IonSpinner,
	],
	providers: [InviteService],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-join-space',
	templateUrl: './join-space-page.component.html',
})
export class JoinSpacePageComponent extends WithSpaceInput {
	private readonly id?: string;
	public inviteInfo?: IJoinSpaceInfoResponse;
	public pin?: string;
	public userID?: string;

	protected readonly $contact = signal<ContactIdAndDboWithSpaceRef>(
		{} as ContactIdAndDboWithSpaceRef,
	);

	readonly nameFields: INamesFormFields = {
		lastName: { required: true },
	};

	readonly wizardFields: Readonly<IPersonFormWizardFields> = {
		relatedAs: { hide: true },
	};

	get userOwnInvite(): boolean {
		return this.inviteInfo?.invite.from.userID === this.userID;
	}

	private action?: 'join' | 'refuse';

	public status: 'loading' | 'reviewing' | 'joining' | 'refusing' | 'refused' =
		'loading';

	public authStatus: AuthStatus = AuthStatuses.authenticating;

	constructor(
		protected readonly route: ActivatedRoute,
		private readonly navService: SpaceNavService,
		private readonly inviteService: InviteService,
		private readonly authStateService: SneatAuthStateService,
	) {
		super('JoinSpacePageComponent');
		this.getActionFromLocationHash();
		this.id = this.route.snapshot.queryParamMap.get('id') || undefined;
		try {
			this.pin = getPinFromUrl();
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to handle URL query parameters');
		}
		if (this.id && this.pin) {
			const errMsg = 'Failed to get team information';
			this.inviteService.getSpaceJoinInfo(this.id, this.pin).subscribe({
				next: (response) => {
					console.log('join_team:', response);
					if (!response) {
						this.errorLogger.logError('EmptyResponse', errMsg);
						return;
					}
					this.inviteInfo = response;
					if (response.member) {
						this.$contact.update((contact) => ({
							...contact,
							dbo: {
								...contact.dbo,
								...response.member,
								roles: undefined,
							},
						}));
					}
					// this.relatedPerson = {
					// 	gender: this.invite.to.
					// }
					if (this.status === 'loading') {
						if (this.authStatus === 'authenticated' && this.action) {
							this.processAction();
						} else {
							this.status = 'reviewing';
						}
					}
				},
				error: (err) => this.errorLogger.logError(err, errMsg),
			});
		}

		this.authStateService.authState.pipe(takeUntil(this.destroyed$)).subscribe({
			next: (authState) => {
				this.userID = authState.user?.uid;
				this.authStatus = authState.status;
				if (authState.status === 'authenticated' && this.inviteInfo) {
					setTimeout(() => {
						this.processAction();
					}, 10);
				}
			},
			error: this.errorLogger.logErrorHandler('failed to get authState'),
		});
	}

	private processAction(): void {
		console.log(
			`processAction(), authState=${this.authStatus}, action: ${this.action}`,
		);
		switch (this.action) {
			case 'join':
				this.joinSpace();
				break;
			case 'refuse':
				this.refuse();
				break;
		}
	}

	private getActionFromLocationHash(): void {
		const m = location.hash.match(/[#&]action=(\w+)/);
		if (!m) {
			return;
		}
		if (m[1] === 'join' || m[1] === 'refuse') {
			this.action = m[1];
		} else {
			console.warn('Unknown action:', m[1]);
		}
	}

	public join(): void {
		if (!this.id) {
			return;
		}
		const spaceID = this.inviteInfo?.space.id;
		if (!spaceID) {
			const m = 'Not able to join a space without ID';
			this.errorLogger.logError(m, undefined, { show: true });
			return;
		}
		if (!this.pin) {
			alert('Please enter the PIN');
		}
		// const to = this.inviteInfo?.invite?.to;
		// if (to?.channel === 'email' && to.address?.toLowerCase().endsWith('gmail.com')) {
		// 	this.authStateService.signInWith('Google').subscribe({
		// 		next: () => this.joinTeam(),
		// 		error: () => this.joinTeam(),
		// 	})
		// }
		if (
			this.authStatus === 'authenticated' ||
			this.inviteInfo?.invite?.to.channel === 'email'
		) {
			this.joinSpace();
		} else {
			this.navService.navigateToLogin({
				queryParams: { to: 'join-team' },
				returnTo: `/join/${this.inviteInfo?.space?.type}?id=${this.id}#pin=${this.pin}&action=join`,
			});
		}
	}

	public refuse(): void {
		if (!this.id || !this.pin || !this.inviteInfo?.space) {
			return;
		}
		this.status = 'refusing';
		const request: IRejectPersonalInviteRequest = {
			spaceID: this.inviteInfo.space.id,
			inviteID: this.id,
			pin: this.pin,
		};
		this.inviteService.rejectPersonalInvite(request).subscribe({
			next: () => {
				this.status = 'refused';
			},
			error: (err) => {
				this.status = 'reviewing';
				this.errorLogger.logError(err, 'Failed to refuse joining a team');
			},
		});
	}

	private joinSpace(): void {
		const space = this.inviteInfo?.space;
		if (!space) {
			this.errorLogger.logError('no team context');
			return;
		}
		if (!this.pin) {
			this.errorLogger.logError('no pin');
			return;
		}
		if (!this.id) {
			this.errorLogger.logError('no invite id');
			return;
		}
		this.status = 'joining';
		const spaceID: string = space.id;
		if (!this.inviteInfo) {
			return;
		}
		const contact = this.$contact();
		const inviteInfo: IJoinSpaceInfoResponse = {
			...this.inviteInfo,
			member: {
				...this.inviteInfo.member,
				names: contact.dbo.names,
				gender: contact.dbo.gender,
				ageGroup: contact.dbo.ageGroup,
			},
		};
		if (!inviteInfo) {
			return;
		}
		switch (this.authStatus) {
			case 'authenticating':
				throw new Error('tried to join while still authenticating');
			case 'authenticated':
				this.inviteService
					.acceptInviteByAuthenticatedUser(inviteInfo)
					.subscribe({
						next: (dto) => {
							console.log('joined team', dto);
							const space: ISpaceContext = {
								id: spaceID,
								brief: inviteInfo.space,
							};
							// this.team = newTeam;
							this.navService
								.navigateToSpace(space, undefined)
								.catch(this.errorLogger.logError);
						},
						error: (err) => {
							this.status = 'reviewing';
							this.errorLogger.logError(err, 'Failed to join a team');
						},
					});
				break;
			case 'notAuthenticated':
				this.inviteService
					.acceptInviteByUnauthenticatedUser(inviteInfo)
					.subscribe({
						next: (dto) => {
							console.log('joined team', dto);
							const space: ISpaceContext = {
								id: spaceID,
								brief: inviteInfo.space,
							};
							// this.team = newTeam;
							this.navService
								.navigateToSpace(space, undefined)
								.catch(this.errorLogger.logError);
						},
						error: (err) => {
							this.status = 'reviewing';
							this.errorLogger.logError(err, 'Failed to join a team');
						},
					});
				break;
		}
	}

	protected onContactChanged(contact: NewContactBaseDboAndSpaceRef): void {
		this.$contact.set(contact as ContactIdAndDboWithSpaceRef);
	}
}
