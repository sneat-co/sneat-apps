import { NgModule } from '@angular/core';
import { ErrorLogger } from './error-logger.interface';
import { ErrorLoggerService } from './error-logger.service';

@NgModule({
	imports: [],
	providers: [
		{
			provide: ErrorLogger,
			useClass: ErrorLoggerService,
		},
	],
})
export class SneatLoggingModule {
}
