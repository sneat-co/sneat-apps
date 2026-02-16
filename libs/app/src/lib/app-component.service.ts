import { Injectable, inject, InjectionToken } from '@angular/core';
import { Platform } from '@ionic/angular/standalone';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

export const SplashScreen = new InjectionToken<any>('SplashScreen');
export const StatusBar = new InjectionToken<any>('StatusBar');

@Injectable()
// TODO: check if it's used and probably remove
export class AppComponentService {
  private readonly platform: Platform;
  private readonly errorLogger: IErrorLogger;
  private readonly splashScreen?: any;
  private readonly statusBar?: any;

  constructor() {
    this.platform = inject(Platform);
    this.errorLogger = inject<IErrorLogger>(ErrorLogger);
    this.splashScreen = inject(SplashScreen, { optional: true });
    this.statusBar = inject(StatusBar, { optional: true });
  }

  public initializeApp() {
    this.platform
      .ready()
      .then(() => {
        try {
          if (this.statusBar) {
            this.statusBar.styleDefault();
          } else {
          }
          if (this.splashScreen) {
            this.splashScreen.hide();
          } else {
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
