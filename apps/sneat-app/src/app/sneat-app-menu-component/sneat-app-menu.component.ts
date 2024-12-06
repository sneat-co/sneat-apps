import { Component } from '@angular/core';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';

@Component({
	selector: 'sneat-app-menu',
	templateUrl: './sneat-app-menu.component.html',
	standalone: false,
})
export class SneatAppMenuComponent {
	public authState?: ISneatAuthState;

	constructor(private readonly authStateService: SneatAuthStateService) {
		authStateService.authState.subscribe((authState) => {
			this.authState = authState;
		});
	}
}
