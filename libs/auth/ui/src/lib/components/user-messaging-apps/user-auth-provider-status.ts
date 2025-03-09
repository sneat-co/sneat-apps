import {
	Component,
	EventEmitter,
	input,
	Output,
	signal,
	computed,
	Inject,
	OnDestroy,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	AuthProviderID,
	ISneatAuthUser,
	SneatAuthStateService,
} from '@sneat/auth-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { Subject, takeUntil } from 'rxjs';

type IonicColor =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'light'
	| 'medium'
	| 'dark';

interface provider {
	readonly id: AuthProviderID;
	readonly title: string;
	readonly icon: string;
	readonly color: IonicColor;
}

@Component({
	selector: 'sneat-user-auth-provider-status',
	templateUrl: './user-auth-provider-status.html',
	imports: [IonicModule],
})
export class UserAuthAProviderStatusComponent implements OnDestroy {
	private readonly $destroyed = new Subject<void>();
	public providerID = input.required<AuthProviderID | undefined>();
	protected readonly provider = computed<provider>(() => {
		const id = this.providerID();
		switch (id) {
			case 'facebook.com':
				return {
					id: id,
					title: 'Facebook',
					icon: 'logo-facebook',
					color: 'primary',
				};
			case 'google.com':
				return {
					id,
					title: 'Google',
					icon: 'logo-google',
					color: 'danger',
				};
			case 'apple.com':
				return {
					id,
					title: 'Apple',
					icon: 'logo-apple',
					color: 'dark',
				};
			case 'microsoft.com':
				return {
					id,
					title: 'Microsoft',
					icon: 'logo-windows',
					color: 'secondary',
				};
			case undefined:
				throw new Error('Undefined provider ID');
			default:
				return {
					id,
					title: id,
					icon: 'help-circle',
					color: 'medium',
				};
		}
	});

	readonly signingInWith = input.required<AuthProviderID | undefined>();

	@Output() readonly signingInWithChange = new EventEmitter<
		AuthProviderID | undefined
	>();

	protected readonly currentUser = signal<ISneatAuthUser | null | undefined>(
		undefined,
	);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly authStateService: SneatAuthStateService,
	) {
		this.authStateService.authUser
			.pipe(takeUntil(this.$destroyed))
			.subscribe((authUser) => {
				this.currentUser.set(authUser);
			});
	}

	protected readonly isSigningIn = computed(
		() => this.signingInWith() === this.providerID(),
	);

	protected readonly isDisabled = computed(() => {
		const signingInWith = this.signingInWith();
		return !!signingInWith;
	});

	readonly authProviderUserInfo = computed(() => {
		const providerID = this.providerID();
		return this.currentUser()?.providerData?.find(
			(pd) => pd.providerId == providerID,
		);
	});

	readonly isConnected = computed(() => !!this.authProviderUserInfo());

	protected connect(): void {
		const providerID = this.providerID();
		if (!providerID) {
			throw new Error('auth providerID is not set');
		}
		this.signingInWithChange.emit(providerID);
		this.authStateService
			.linkWith(providerID)
			.then(() => {
				this.signingInWithChange.emit(undefined);
			})
			.catch((e) => {
				console.error('Failed to connect', e);
				this.signingInWithChange.emit(undefined);
			});
	}

	protected disconnect(): void {
		const providerID = this.providerID();
		if (!providerID) {
			this.errorLogger.logError('auth providerID is not set');
			return;
		}
		this.authStateService
			.unlinkAuthProvider(providerID)
			.then(() => this.signingInWithChange.emit(undefined))
			.catch((err) => {
				this.signingInWithChange.emit(undefined);
				this.errorLogger.logError(err);
			});
		this.signingInWithChange.emit(providerID);
	}

	public ngOnDestroy(): void {
		this.$destroyed.next();
		this.$destroyed.complete();
	}
}
