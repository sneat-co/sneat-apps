import { NgModule, Provider } from '@angular/core';
import { ErrorLogger } from './interfaces';
import { ErrorLoggerService } from './error-logger.service';

export function provideErrorLogger(): Provider {
	return {
		provide: ErrorLogger,
		useClass: ErrorLoggerService,
	};
}

@NgModule({
	imports: [],
	providers: [provideErrorLogger()],
})
export class SneatLoggingModule {}
