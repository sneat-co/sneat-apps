import { NgModule } from '@angular/core';
import { ErrorLogger } from './interfaces';
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
export class SneatLoggingModule {}
