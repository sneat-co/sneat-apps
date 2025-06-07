import { Component, inject } from '@angular/core';

import { Platform } from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-root',
	templateUrl: 'app.component.html',
})
export class AppComponent {
	private platform = inject(Platform);

	constructor() // private statusBar: StatusBar
	{
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// this.statusBar.styleDefault();
			// this.splashScreen.hide();
		});
	}
}
