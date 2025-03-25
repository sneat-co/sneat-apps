import { Inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import {
	APP_INFO,
	IAppInfo,
	ILoggerFactory,
	LOGGER_FACTORY,
	NgModulePreloaderService,
} from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';

@Injectable()
export class SpaceComponentBaseParams {
	// TODO: verify it should be declared in providers attribute for each page or can be just on app level?
	constructor(
		@Inject(ErrorLogger) public readonly errorLogger: IErrorLogger,
		@Inject(LOGGER_FACTORY) public readonly loggerFactory: ILoggerFactory,
		@Inject(APP_INFO) protected readonly appService: IAppInfo, // Check if used anywhere
		// public readonly changeDetectorRef: ChangeDetectorRef,
		public readonly navController: NavController,
		public readonly userService: SneatUserService,
		public readonly spaceService: SpaceService,
		public readonly spaceNavService: SpaceNavService,
		// public readonly contactusTeamService: ContactusTeamService,
		public readonly preloader: NgModulePreloaderService,
	) {}
}
