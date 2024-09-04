import { Inject, Injectable } from '@angular/core';
import { excludeUndefined } from '@sneat/core';
import { ContactRole } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceNavService } from '@sneat/team-services';

export interface INewContactPageParams {
	group?: string;
	role?: ContactRole;
	asset?: string;
	document?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactNavService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly spaceNavService: SpaceNavService,
	) {}

	goNewContactPage(space: ISpaceContext, params?: INewContactPageParams): void {
		this.spaceNavService
			.navigateForwardToSpacePage(space, 'new-contact', {
				queryParams: excludeUndefined(params),
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to "new-contact" page',
				),
			);
	}
}
