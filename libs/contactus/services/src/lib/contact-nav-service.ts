import { Injectable, inject } from '@angular/core';
import { excludeUndefined } from '@sneat/core';
import { ContactRole } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';

export interface INewContactPageParams {
	group?: string;
	role?: ContactRole;
	asset?: string;
	document?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactNavService {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly spaceNavService = inject(SpaceNavService);

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
