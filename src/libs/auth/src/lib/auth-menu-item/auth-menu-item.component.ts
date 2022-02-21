import { Component } from "@angular/core";
import { ISneatAuthState, SneatAuthStateService } from "@sneat/auth";

@Component({
	selector: "sneat-auth-menu-item",
	templateUrl: "./auth-menu-item.component.html",
})
export class AuthMenuItemComponent {

	public authState?: ISneatAuthState;

	constructor(
		authStateService: SneatAuthStateService,
	) {
		authStateService.authState.subscribe({
			next: authState => this.authState = authState,
		});
	}

}
