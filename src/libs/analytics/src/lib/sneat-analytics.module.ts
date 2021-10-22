import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AnalyticsService } from './analytics.interface';
import { FireAnalyticsService } from './fire-analytics.service';
import { SneatLoggingModule } from '@sneat/logging';

@NgModule({
	imports: [AngularFireModule, SneatLoggingModule],
	providers: [
		{
			provide: AnalyticsService,
			useClass: FireAnalyticsService,
		},
	],
})
export class SneatAnalyticsModule {}
