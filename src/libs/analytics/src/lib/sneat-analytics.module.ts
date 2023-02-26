import { NgModule } from '@angular/core';
import { AnalyticsService } from './analytics.interface';
import { FireAnalyticsService } from './fire-analytics.service';
import { SneatLoggingModule } from '@sneat/logging';

@NgModule({
	imports: [SneatLoggingModule],
	providers: [
		{
			provide: AnalyticsService,
			useClass: FireAnalyticsService,
		},
	],
})
export class SneatAnalyticsModule {
}
