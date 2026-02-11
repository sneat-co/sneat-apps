import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
	IonItem,
	IonLabel,
	IonList,
	ModalController,
} from '@ionic/angular/standalone';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { AppVersionComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { filter } from 'rxjs';

@Component({
	selector: 'sneat-app-menu',
	templateUrl: './sneat-app-menu.component.html',
	providers: [ModalController],
	imports: [
		SpacesMenuComponent,
		AuthMenuItemComponent,
		AppVersionComponent,
		IonItem,
		IonLabel,
		IonList,
		SpaceServiceModule,
	],
})
export class SneatAppMenuComponent {
	private readonly authStateService = inject(SneatAuthStateService);
	private readonly router = inject(Router);

	public authState?: ISneatAuthState;

	protected readonly isLoginPage = signal(false);

	constructor() {
		this.isLoginPage.set(this.router.url === '/login');

		this.router.events
			.pipe(filter((e) => e instanceof NavigationEnd))
			.subscribe((e) => {
				this.isLoginPage.set(
					(e as NavigationEnd).urlAfterRedirects === '/login',
				);
			});

		this.authStateService.authState.subscribe((authState) => {
			this.authState = authState;
		});
	}
}
