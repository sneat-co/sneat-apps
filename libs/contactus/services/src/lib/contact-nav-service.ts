import { Inject, Injectable } from '@angular/core';
import { excludeUndefined } from '@sneat/core';
import { ContactRole } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { TeamNavService } from '@sneat/team-services';

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
		private readonly teamNavService: TeamNavService,
	) {}

	goNewContactPage(team: ISpaceContext, params?: INewContactPageParams): void {
		this.teamNavService
			.navigateForwardToSpacePage(team, 'new-contact', {
				queryParams: excludeUndefined(params),
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'failed to navigate to "new-contact" page',
				),
			);
	}
}
