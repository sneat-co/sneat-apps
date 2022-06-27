import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-express-menu',
	templateUrl: './express-menu.component.html',
	styleUrls: ['./express-menu.component.scss'],
})
export class ExpressMenuComponent implements OnInit {
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
