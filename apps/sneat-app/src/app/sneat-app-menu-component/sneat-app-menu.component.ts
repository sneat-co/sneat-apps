import { Component } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';
import { AppVersionComponent, AuthMenuItemComponent } from '@sneat/components';
import { SpacesMenuComponent } from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';

@Component({
	selector: 'sneat-app-menu',
	templateUrl: './sneat-app-menu.component.html',
	imports: [
		SpacesMenuComponent,
		AuthMenuItemComponent,
		AppVersionComponent,
		IonList,
		SpaceServiceModule,
	],
})
export class SneatAppMenuComponent {
	public authState?: ISneatAuthState;

	constructor(private readonly authStateService: SneatAuthStateService) {
		authStateService.authState.subscribe((authState) => {
			this.authState = authState;
		});
	}
}
