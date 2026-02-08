import { Injectable, inject } from '@angular/core';
import {
	APP_INFO,
	IAppInfo,
	ILoggerFactory,
	LOGGER_FACTORY,
	NgModulePreloaderService,
} from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { SpaceNavService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';

@Injectable()
export class SpaceComponentBaseParams {
	readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	readonly loggerFactory = inject<ILoggerFactory>(LOGGER_FACTORY);
	protected readonly appService = inject<IAppInfo>(APP_INFO);
	readonly userService = inject(SneatUserService);
	readonly spaceNavService = inject(SpaceNavService);
	readonly preloader = inject(NgModulePreloaderService);
}
