import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth-core';

@Component({
	standalone: true,
	selector: 'sneat-login-required',
	templateUrl: './login-required.component.html',
	imports: [
		IonicModule,
		CommonModule,
		RouterModule,
	],
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
