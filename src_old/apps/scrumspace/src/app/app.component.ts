import { Component, inject } from '@angular/core';

import { Platform } from '@ionic/angular/standalone';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
	selector: 'sneat-root',
	templateUrl: 'app.component.html',
})
export class AppComponent {
	private platform = inject(Platform);
	private splashScreen = inject(SplashScreen);
	private statusBar = inject(StatusBar);

	constructor() {
		this.initializeApp();
	}

	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}
}
