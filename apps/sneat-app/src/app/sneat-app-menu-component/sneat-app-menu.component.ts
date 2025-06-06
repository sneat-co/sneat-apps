import { Component, inject } from '@angular/core';
import { IonList, ModalController } from '@ionic/angular/standalone';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';
import { AuthMenuItemComponent } from '@sneat/auth-ui';
import { AppVersionComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';

@Component({
	selector: 'sneat-app-menu',
	templateUrl: './sneat-app-menu.component.html',
	providers: [ModalController],
	imports: [
		SpacesMenuComponent,
		AuthMenuItemComponent,
		AppVersionComponent,
		IonList,
		SpaceServiceModule,
	],
})
export class SneatAppMenuComponent {
	private readonly authStateService = inject(SneatAuthStateService);

	public authState?: ISneatAuthState;

	constructor() {
		const authStateService = this.authStateService;

		authStateService.authState.subscribe((authState) => {
			this.authState = authState;
		});
	}
}
