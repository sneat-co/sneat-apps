import { Component, Inject } from "@angular/core";
import { ISneatAuthState, SneatAuthStateService } from "@sneat/auth";

@Component({
	selector: "sneat-app-menu",
	templateUrl: "./sneat-app-menu.component.html",
})
export class SneatAppMenuComponent {

	public authState?: ISneatAuthState;

	constructor(
		private readonly authStateService: SneatAuthStateService,
	) {
		authStateService.authState.subscribe(authState => {
			this.authState = authState;
		});
	}

}
