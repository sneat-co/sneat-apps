import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { ISneatAuthState, SneatAuthStateService } from '@sneat/auth';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-express-menu',
	templateUrl: './express-team-menu.component.html',
	styleUrls: ['./express-team-menu.component.scss'],
})
export class ExpressTeamMenuComponent implements OnInit {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	public team?: ITeamContext = {
		id: 'fastline',
		brief: {id: 'fastline', type: 'company', title: 'FastLine'},
	};

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
