import { inject } from '@angular/core';
import {
  ContactService,
  ContactusSpaceService,
} from '@sneat/contactus-services';
import {
  IContactBrief,
  IContactDbo,
  IContactContext,
} from '@sneat/contactus-core';
import { SpaceItemPageBaseComponent } from '@sneat/space-components';
import { Observable, takeUntil, throwError } from 'rxjs';

export abstract class ContactBasePage extends SpaceItemPageBaseComponent<
  IContactBrief,
  IContactDbo
> {
  protected readonly $contact = this.$item.asReadonly();
  protected readonly $contactID = this.$itemID;

  public get contact() {
    return this.$contact();
  }

  protected readonly contactusSpaceService = inject(ContactusSpaceService);

  protected constructor(
    protected readonly contactService: ContactService,
    defaultBackPage: 'contacts' | 'members' = 'contacts',
  ) {
    super(defaultBackPage, 'contact', contactService);
  }

  protected override watchItemChanges(): Observable<IContactContext> {
    const itemID = this.$itemID();
    if (!itemID) {
      return throwError(() => new Error('no contact context'));
    }
    const space = this.space;
    if (!space) {
      return throwError(() => new Error('no team context'));
    }
    return this.contactService.watchContactById(space, itemID);
    // .pipe(this.takeUntilNeeded(), takeUntil(this.spaceIDChanged$))
  }

  protected override briefs(): Record<string, IContactBrief> | undefined {
    return undefined;
    // throw new Error('Method not implemented.'); // return this.contactusTeam?.dto?.contacts;
  }

  protected override onSpaceIdChanged(): void {
    super.onSpaceIdChanged();
    this.watchSpaceContactusEntry();
  }

  private watchSpaceContactusEntry(): void {
    if (this.space?.id) {
      this.contactusSpaceService
        .watchContactBriefs(this.space.id)
        .pipe(this.takeUntilDestroyed(), takeUntil(this.spaceIDChanged$))
        .subscribe({
          next: (contacts) => {
            console.log(
              'watchSpaceContactusEntry() => contacts:',
              contacts,
              'this.contact:',
              this.contact,
            );
            if (this.contact?.id && !this.contact?.dbo) {
              const contactID = this.contact.id;
              const contact = contacts.find((c) => c.id === contactID);
              if (contact) {
                console.log(
                  'setItemContext from contact space brief',
                  contact.brief,
                );
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
