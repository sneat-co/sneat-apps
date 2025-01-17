import { Inject, Injectable } from '@angular/core';
import { ISlotUIEvent } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { SpaceNavService } from '@sneat/team-services';

@Injectable()
export class CalendarNavService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly spaceNavService: SpaceNavService,
	) {}

	public navigateToHappeningPage(args: ISlotUIEvent): void {
		const happening: IHappeningContext = args.slot.happening;
		const page = `happening/${happening.id}`;
		this.spaceNavService
			.navigateForwardToSpacePage(happening.space, page, {
				state: { happening },
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to recurring happening page',
				),
			);
	}
}
