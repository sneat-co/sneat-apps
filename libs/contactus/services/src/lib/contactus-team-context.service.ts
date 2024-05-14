import { IContactusTeamDtoAndID } from '@sneat/contactus-core';
import { ContactusTeamService } from './contactus-team.service';
import { IErrorLogger } from '@sneat/logging';
import { Observable, Subject, takeUntil } from 'rxjs';

export class ContactusTeamContextService {
	private readonly contactusTeamContext = new Subject<IContactusTeamDtoAndID>();

	public readonly contactusTeamContext$ =
		this.contactusTeamContext.asObservable();

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly destroyed$: Observable<void>,
		private readonly teamID$: Observable<string | undefined>,
		private readonly contactusTeamService: ContactusTeamService,
	) {
		destroyed$.subscribe(() => {
			this.contactusTeamContext.complete();
		});
		teamID$.pipe(takeUntil(destroyed$)).subscribe({
			next: this.subscribeForContactusTeamChanges,
		});
	}

	private subscribeForContactusTeamChanges(teamID?: string): void {
		console.log(`subscribeForContactusTeamChanges(teamID=${teamID})`);
		if (!teamID) {
			return;
		}
		this.contactusTeamService
			.watchTeamModuleRecord(teamID)
			.pipe(takeUntil(this.teamID$), takeUntil(this.destroyed$))
			.subscribe({
				next: (o) => this.onContactusTeamChanged(o),
				error: this.errorLogger.logErrorHandler(
					'failed to get contactus team record',
				),
			});
	}

	private onContactusTeamChanged(contactusTeam: IContactusTeamDtoAndID): void {
		this.contactusTeamContext.next(contactusTeam);
	}
}
