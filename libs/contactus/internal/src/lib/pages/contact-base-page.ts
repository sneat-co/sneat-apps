import { ActivatedRoute } from '@angular/router';
import {
	ContactService,
	ContactusTeamService,
} from '@sneat/contactus-services';
import { ContactComponentBaseParams } from '@sneat/contactus-shared';
import {
	IContactBrief,
	IContactDto,
	IContactContext,
} from '@sneat/contactus-core';
import { TeamItemPageBaseComponent } from '@sneat/team-components';
import { Observable, takeUntil, throwError } from 'rxjs';

export abstract class ContactBasePage extends TeamItemPageBaseComponent<
	IContactBrief,
	IContactDto
> {
	public get contact(): IContactContext | undefined {
		return this.item as IContactContext;
	}

	protected readonly contactusTeamService: ContactusTeamService;
	protected readonly contactService: ContactService;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// protected preloader: NgModulePreloaderService,
	) {
		super(
			className,
			route,
			params.teamParams,
			'contacts',
			'contact',
			params.contactService,
		);
		this.contactusTeamService = params.contactusTeamService;
		this.contactService = params.contactService;
		this.defaultBackPage = 'contacts';
		// this.trackContactId();
	}

	protected override watchItemChanges(): Observable<IContactContext> {
		if (!this.item?.id) {
			return throwError(() => new Error('no contact context'));
		}
		const team = this.space;
		if (!team) {
			return throwError(() => new Error('no team context'));
		}
		return this.contactService.watchContactById(team, this.item?.id);
		// .pipe(this.takeUntilNeeded(), takeUntil(this.teamIDChanged$))
	}

	override setItemContext(item: IContactContext): void {
		super.setItemContext(item);
		this.console.log('ContactBasePage.setItemContext()', item);
		// this.contact = item;
	}

	protected override briefs(): Record<string, IContactBrief> | undefined {
		throw new Error('Method not implemented.'); // return this.contactusTeam?.dto?.contacts;
	}

	protected onContactIdChanged(contactID: string): void {
		console.log('ContactBasePage.onContactIdChanged()', contactID);
		// this.watchContact();
	}

	override onTeamIdChanged(): void {
		super.onTeamIdChanged();
		this.watchTeamContactusEntry();
	}

	private watchTeamContactusEntry(): void {
		if (this.space?.id) {
			this.contactusTeamService
				.watchContactBriefs(this.space.id)
				.pipe(this.takeUntilNeeded(), takeUntil(this.teamIDChanged$))
				.subscribe({
					next: (contacts) => {
						console.log(
							'watchTeamContactusEntry() => contacts:',
							contacts,
							'this.contact:',
							this.contact,
						);
						if (this.contact?.id && !this.contact?.dbo) {
							const contactID = this.contact.id;
							const contact = contacts.find((c) => c.id === contactID);
							if (contact) {
								this.setItemContext({ ...this.contact, brief: contact.brief });
								// this.contact = { brief: contact.brief, ...this.contact };
								// this.teamParams.changeDetectorRef.detectChanges();
							}
						}
					},
				});
		}
	}

	// private watchContact(): void {
	// 	console.log('ContactBasePage.watchContact()');
	// 	if (!this.contact?.id) {
	// 		return;
	// 	}
	// 	const team = this.team;
	// 	if (!team) {
	// 		return;
	// 	}
	// 	this.contactService
	// 		.watchContactById(team, this.contact?.id)
	// 		.pipe(this.takeUntilNeeded())
	// 		.subscribe({
	// 			next: (contact) => {
	// 				console.log('watchContact =>', contact);
	// 				if (!contact) {
	// 					return;
	// 				}
	// 				this.contact = contact;
	// 			},
	// 			error: this.errorLogger.logErrorHandler('failed to get contact by ID'),
	// 		});
	// }

	// private trackContactId(): void {
	// 	console.log('ContactBasePage.trackContactId()');
	// 	this.route.paramMap
	// 		.pipe(
	// 			this.takeUntilNeeded(),
	// 			map((params) => params.get('contactID')),
	// 			distinctUntilChanged(),
	// 		)
	// 		.subscribe({
	// 			next: (contactID) => {
	// 				console.log('trackContactId() =>', contactID, this.contact);
	// 				if (!contactID) {
	// 					this.contact = undefined;
	// 					return;
	// 				}
	// 				const team = this.team;
	// 				this.contact = {
	// 					id: contactID,
	// 					brief: undefined,
	// 					dto: undefined,
	// 					team,
	// 				};
	// 				this.onContactIdChanged(contactID);
	// 			},
	// 			error: this.logErrorHandler(),
	// 		});
	// }
}
