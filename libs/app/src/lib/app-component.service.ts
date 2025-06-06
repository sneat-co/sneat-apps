import { Injectable, inject } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable()
// TODO: check if it's used and probably remove
export class AppComponentService {
	private platform = inject(Platform);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private splashScreen = inject(SplashScreen, { optional: true });
	private statusBar = inject(StatusBar, { optional: true });

	public initializeApp() {
		this.platform
			.ready()
			.then(() => {
				try {
					if (this.statusBar) {
						this.statusBar.styleDefault();
					} else {
						console.log('statusBar is not provided');
					}
					if (this.splashScreen) {
						this.splashScreen.hide();
					} else {
						console.log('splashScreen is not provided');
					}
					// this.analyticsService.logEvent('platform_ready');
				} catch (e) {
					this.errorLogger.logError(
						e,
						'failed to handle "platform_ready" event',
					);
				}
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to initialize Platform@ionic/angular',
				),
			);
	}
}
