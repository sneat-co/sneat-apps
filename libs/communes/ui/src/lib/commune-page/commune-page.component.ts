import { Component } from '@angular/core';
import { LoginRequiredServiceService } from '@sneat/auth-core';

@Component({
	selector: 'sneat-commune-page',
	templateUrl: './commune-page.component.html',
	standalone: false,
})
export class CommunePageComponent {
	constructor(
		private readonly loginRequiredService: LoginRequiredServiceService,
	) {}
}
