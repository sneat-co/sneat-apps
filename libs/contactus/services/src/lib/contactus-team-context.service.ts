import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ContactusTeamService } from './contactus-team.service';
import { IErrorLogger } from '@sneat/logging';
import { Observable, Subject, takeUntil } from 'rxjs';

export class ContactusTeamContextService {
	private readonly contactusTeamContext =
		new Subject<IContactusSpaceDboAndID>();

	public readonly contactusTeamContext$ =
		this.contactusTeamContext.asObservable();

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly destroyed$: Observable<void>,
		private readonly teamID$: Observable<string | undefined>,
		private readonly contactusTeamService: ContactusTeamService,
	) {
		// TypeError: this._throwIfClosed is not a function at Subject.js:54:18
		// destroyed$.subscribe(this.contactusTeamContext.complete);

		teamID$.pipe(takeUntil(destroyed$)).subscribe({
			next: this.subscribeForContactusTeamChanges,
		});
	}

	private readonly subscribeForContactusTeamChanges = (
		teamID?: string,
	): void => {
		if (!teamID) {
			return;
		}
		// console.log(`subscribeForContactusTeamChanges(teamID=${teamID})`);
		this.contactusTeamService
			.watchSpaceModuleRecord(teamID)
			.pipe(takeUntil(this.teamID$), takeUntil(this.destroyed$))
			.subscribe({
				next: this.onContactusTeamChanged,
				error: this.errorLogger.logErrorHandler(
					'failed to get contactus team record',
				),
			});
	};

	private readonly onContactusTeamChanged = (
		contactusTeam: IContactusSpaceDboAndID,
	): void => {
		this.contactusTeamContext.next(contactusTeam);
	};
}
