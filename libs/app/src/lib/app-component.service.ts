import { Inject, Injectable, Optional } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable()
export class AppComponentService {
	constructor(
		private platform: Platform,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Optional() private splashScreen: SplashScreen,
		@Optional() private statusBar: StatusBar, // @Inject(AnalyticsService) private readonly analyticsService: IAnalyticsService,
	) {}

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
