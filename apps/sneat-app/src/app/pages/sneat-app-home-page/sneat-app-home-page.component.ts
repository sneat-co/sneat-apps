import { JsonPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
	inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonLabel,
	IonMenuButton,
	IonRow,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { AuthStatus, SneatAuthStateService } from '@sneat/auth-core';
import { UserCountryComponent } from '@sneat/components';
import { ClassName, SneatBaseComponent } from '@sneat/ui';
import { ForEducatorsComponent } from './for-educators.component';
import { ForFamiliesComponent } from './for-families.component';
import { ForWorkComponent } from './for-work.component';

@Component({
	selector: 'sneat-sneat-app-home-page',
	templateUrl: './sneat-app-home-page.component.html',
	imports: [
		RouterModule,
		UserCountryComponent,
		ForFamiliesComponent,
		ForEducatorsComponent,
		ForWorkComponent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonMenuButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonLabel,
		IonContent,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonGrid,
		IonRow,
		IonCol,
		JsonPipe,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: ClassName,
			useValue: 'SneatAppHomePageComponent',
		},
	],
})
export class SneatAppHomePageComponent extends SneatBaseComponent {
	protected readonly $authStatus = signal<AuthStatus | undefined>(undefined);
	protected readonly $isAuthenticating = computed(() => !this.$authStatus());
	protected readonly $isAuthenticated = computed<boolean>(
		() => this.$authStatus() === 'authenticated',
	);

	protected readonly url: string = location.href;

	protected readonly $err = signal<unknown>(undefined);

	public constructor() {
		super();
		const authStateService = inject(SneatAuthStateService);
		authStateService.authState.pipe(this.takeUntilDestroyed()).subscribe({
			next: (authState) => {
				this.$authStatus.set(authState.status);
				if (authState.status === 'notAuthenticated') {
					// router.navigate(['login']).catch((err) => {
					// 	this.$err.set(err);
					// 	errorLogger.logError(err, 'Failed to navigate to login page');
					// });
				} else if (authState.err) {
					this.$err.set(authState.err);
				}
			},
			error: (err) => {
				this.$err.set(err);
				this.errorLogger.logError(err, 'Failed to get authState');
			},
		});
	}
}
