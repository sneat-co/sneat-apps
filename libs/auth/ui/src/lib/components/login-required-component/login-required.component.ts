import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonCard, IonCardContent, IonText } from '@ionic/angular/standalone';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';

@Component({
	selector: 'sneat-login-required',
	templateUrl: './login-required.component.html',
	imports: [RouterModule, IonCard, IonCardContent, IonText],
})
export class LoginRequiredComponent {
	public authState?: ISneatAuthState;

	constructor(authStateService: SneatAuthStateService) {
		authStateService.authState.subscribe({
			next: (authState) => (this.authState = authState),
		});
	}
}
