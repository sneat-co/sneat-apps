import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth';

@Component({
	selector: 'sneat-express-menu',
	templateUrl: './logist-menu.component.html',
	styleUrls: ['./logist-menu.component.scss'],
})
export class LogistMenuComponent implements OnInit {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	public authState?: ISneatAuthState;

	constructor(
		private readonly router: Router,
		private readonly authStateService: SneatAuthStateService,
	) {
		authStateService.authState.subscribe(authState => {
			this.authState = authState;
		});
	}


	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof ActivationStart && e.snapshot.outlet === 'menu')
				this.outlet?.deactivate();
		});
	}
}
