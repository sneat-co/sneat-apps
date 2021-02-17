import {Inject, Injectable} from '@angular/core';
import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';

@Injectable()
export class AppComponentService {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
    // @Inject(AnalyticsService) private readonly analyticsService: IAnalyticsService,
  ) {

  }

  public initializeApp() {
    this.platform.ready().then(() => {
      try {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        // this.analyticsService.logEvent('platform_ready');
      } catch (e) {
        this.errorLogger.logError(e, 'failed to handle "platform_ready" event');
      }
    });
  }
}
