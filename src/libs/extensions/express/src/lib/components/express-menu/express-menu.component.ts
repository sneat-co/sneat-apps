import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';

@Component({
	selector: 'sneat-express-menu',
	templateUrl: './express-menu.component.html',
	styleUrls: ['./express-menu.component.scss'],
})
export class ExpressMenuComponent implements OnInit {
	@ViewChild(RouterOutlet) outlet?: RouterOutlet;

	constructor(
		private router: Router,
	) {
	}

	ngOnInit(): void {
		this.router.events.subscribe(e => {
			if (e instanceof ActivationStart && e.snapshot.outlet === 'menu')
				this.outlet?.deactivate();
		});
	}
}
