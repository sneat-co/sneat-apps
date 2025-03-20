import { NgModule } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AnalyticsService } from './analytics.interface';
import { FireAnalyticsService } from './fire-analytics.service';
import { ErrorLogger, IErrorLogger, SneatLoggingModule } from '@sneat/logging';
import { MultiAnalyticsService } from './multi-analytics.service';
import { PosthogAnalyticsService } from './posthog-analytics.service';

@NgModule({
	imports: [SneatLoggingModule],
	providers: [
		{
			provide: AnalyticsService,
			deps: [ErrorLogger],
			useFactory: (
				errorLogger: IErrorLogger,
				angularFireAnalytics: AngularFireAnalytics,
			) =>
				new MultiAnalyticsService([
					new FireAnalyticsService(errorLogger, angularFireAnalytics),
					new PosthogAnalyticsService(),
				]),
		},
	],
})
export class SneatAnalyticsModule {}
