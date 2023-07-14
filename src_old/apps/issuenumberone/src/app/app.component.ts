import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';

@Component({
	selector: 'sneat-root',
	templateUrl: 'app.component.html',
})
export class AppComponent {
	constructor(
		private platform: Platform, // private splashScreen: SplashScreen,
	) // private statusBar: StatusBar
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
