import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ContactusSpaceService } from './contactus-space.service';
import { IErrorLogger } from '@sneat/logging';
import { Observable, Subject, takeUntil } from 'rxjs';

export class ContactusSpaceContextService {
	private readonly contactusSpaceContext =
		new Subject<IContactusSpaceDboAndID>();

	public readonly contactusSpaceContext$ =
		this.contactusSpaceContext.asObservable();

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly destroyed$: Observable<void>,
		private readonly spaceID$: Observable<string | undefined>,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		// TypeError: this._throwIfClosed is not a function at Subject.js:54:18
		// destroyed$.subscribe(this.contactusTeamContext.complete);

		spaceID$.pipe(takeUntil(destroyed$)).subscribe({
			next: this.subscribeForContactusSpaceChanges,
		});
	}

	private readonly subscribeForContactusSpaceChanges = (
		teamID?: string,
	): void => {
		if (!teamID) {
			return;
		}
		// console.log(`subscribeForContactusSpaceChanges(teamID=${teamID})`);
		this.contactusSpaceService
			.watchSpaceModuleRecord(teamID)
			.pipe(takeUntil(this.spaceID$), takeUntil(this.destroyed$))
			.subscribe({
				next: this.onContactusSpaceChanged,
				error: this.errorLogger.logErrorHandler(
					'failed to get contactus team record',
				),
			});
	};

	private readonly onContactusSpaceChanged = (
		contactusTeam: IContactusSpaceDboAndID,
	): void => {
		this.contactusSpaceContext.next(contactusTeam);
	};
}
