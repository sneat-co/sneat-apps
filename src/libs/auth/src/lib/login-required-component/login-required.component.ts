import { Component } from '@angular/core';
import { ISneatAuthState, SneatAuthStateService } from '../sneat-auth-state-service';

@Component({
	selector: 'sneat-login-required',
	templateUrl: './login-required.component.html',
})
export class LoginRequiredComponent {

	public authState?: ISneatAuthState;

	constructor(
		authStateService: SneatAuthStateService,
	) {
		authStateService.authState.subscribe({
			next: authState => this.authState = authState,
		});
	}

}
