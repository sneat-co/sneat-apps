import { inject } from '@angular/core';
import { SneatUserService } from '@sneat/auth-core';
import { IContactusSpaceDboAndID } from '@sneat/contactus-core';
import { ContactusSpaceService } from './contactus-space.service';
import { ErrorLogger } from '@sneat/logging';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';

// TODO: ContactusSpaceContextService can be abstracted and reused by other entities
export class ContactusSpaceContextService {
	// Is used to emit contactus space record changes
	private readonly contactusSpaceContext = new Subject<
		IContactusSpaceDboAndID | undefined
	>();

	public readonly contactusSpaceContext$ =
		this.contactusSpaceContext.asObservable();

	private spaceID?: string;
	private spaceModuleRecordSub?: Subscription;

	private readonly errorLogger = inject(ErrorLogger);
	private readonly userService = inject(SneatUserService);
	private readonly contactusSpaceService = inject(ContactusSpaceService);

	constructor(
		private readonly destroyed$: Observable<void>,
		private readonly spaceID$: Observable<string | undefined>,
	) {
		destroyed$.subscribe({
			next: () => {
				this.contactusSpaceContext.complete();
			},
		});
		spaceID$.pipe(takeUntil(destroyed$)).subscribe({
			next: (spaceID) => {
				this.spaceID = spaceID;
				if (this.userService.currentUserID) {
					this.subscribeForContactusSpaceChanges(spaceID);
				}
			},
		});
		this.userService.userChanged.pipe(takeUntil(destroyed$)).subscribe({
			next: (uid) => {
				if (uid) {
					console.log('ContactusSpaceContextService: user changed: uid=', uid);
					this.subscribeForContactusSpaceChanges(this.spaceID);
				} else {
					console.log('ContactusSpaceContextService: user signed out');
					this.spaceModuleRecordSub?.unsubscribe();
					this.contactusSpaceContext.next(undefined);
				}
			},
		});
	}

	private readonly subscribeForContactusSpaceChanges = (
		spaceID?: string,
	): void => {
		this.spaceModuleRecordSub?.unsubscribe();
		if (!spaceID) {
			return;
		}
		console.log(`subscribeForContactusSpaceChanges(spaceID=${spaceID})`);
		this.spaceModuleRecordSub = this.contactusSpaceService
			.watchSpaceModuleRecord(spaceID)
			.pipe(takeUntil(this.spaceID$), takeUntil(this.destroyed$))
			.subscribe({
				next: this.onContactusSpaceChanged,
				error: this.errorLogger.logErrorHandler(
					'ContactusSpaceContextService: failed to get contactus space record',
				),
			});
	};

	private readonly onContactusSpaceChanged = (
		contactusSpace: IContactusSpaceDboAndID,
	): void => {
		console.log(
			'ContactusSpaceContextService.onContactusSpaceChanged()',
			contactusSpace,
		);
		this.contactusSpaceContext.next(contactusSpace);
	};
}
