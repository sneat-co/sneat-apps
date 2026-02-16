import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  Output,
  signal,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardTitle,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import {
  ContactsChecklistComponent,
  ContactsSelectorService,
  ContactsSelectorModule,
  ICheckChangedArgs,
  IContactSelectorProps,
} from '@sneat/contactus-shared';
import { AnalyticsService } from '@sneat/core';
import {
  addRelatedItem,
  getRelatedItemIDs,
  ISpaceModuleItemRef,
  removeRelatedItem,
} from '@sneat/dto';
import { IHappeningContext, IHappeningBase } from '@sneat/mod-schedulus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import {
  HappeningService,
  IHappeningContactRequest,
  IHappeningContactsRequest,
} from '../../services/happening.service';

function capitalizeFirstChar(str: string): string {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

@Component({
  imports: [
    ContactsChecklistComponent,
    ContactsSelectorModule,
    IonCard,
    IonItem,
    IonCardTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonItemGroup,
    IonItemDivider,
  ],
  providers: [
    { provide: ClassName, useValue: 'HappeningParticipantsComponent' },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-happening-participants',
  templateUrl: 'happening-participants.component.html',
})
export class HappeningParticipantsComponent extends WithSpaceInput {
  private readonly happeningService = inject(HappeningService);

  public readonly $happening = input.required<IHappeningContext>();

  // protected readonly $space = computed(() => this.$happening().space);
  // protected readonly $spaceID = computed(() => this.$space().id);

  private readonly userService = inject(SneatUserService);

  protected readonly $membersTabLabel = computed(() => {
    const spaceType = this.$space().type;
    return spaceType === 'family'
      ? 'Family members'
      : spaceType
        ? capitalizeFirstChar(spaceType) + ' members'
        : 'Members';
  });

  protected readonly $showMembersList = computed(
    () => this.$space().type === 'family',
  );

  @Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

  protected readonly $relatedContactIDs = computed(() => {
    const happening = this.$happening();
    return getRelatedItemIDs(
      happening.dbo?.related || happening.brief?.related,
      'contactus',
      'contacts',
      this.$spaceID(),
    );
  });

  private readonly contactSelectorService = inject(ContactsSelectorService);

  private readonly analytics = inject(AnalyticsService);

  public constructor() {
    super();
  }

  protected onCheckChanged(args: ICheckChangedArgs): void {
// console.log('HappeningParticipantsComponent.onCheckChanged()', args);
    this.analytics.logEvent(
      `happening/participants/${args.checked ? 'checked' : 'unchecked'}`,
    );
    const happening = this.$happening();

    if (!happening.id) {
      this.addRemoveRelated([args]);
      args.resolve();
      return;
    }

    const request: IHappeningContactRequest = {
      spaceID: this.$spaceID(),
      happeningID: happening?.id,
      contact: { id: args.id },
    };
    const apiCall = args.checked
      ? this.happeningService.addParticipant
      : this.happeningService.removeParticipant;
    apiCall(request).subscribe({
      next: () => {
        this.addRemoveRelated([args]);
        args.resolve();
      },
      error: args.reject,
    });
  }

  private readonly emitHappeningChange = (happening: IHappeningContext) =>
    this.happeningChange.emit(happening);

  private addRemoveRelated(args: readonly ICheckChangedArgs[]): void {
    let happening = this.$happening();
    const { brief, dbo } = happening;
    if (!brief || !dbo) {
      return;
    }
    let happeningBase: IHappeningBase = {
      ...(dbo || brief),
    };
    args.forEach((arg) => {
      const itemKey: ISpaceModuleItemRef = {
        module: 'contactus',
        collection: 'contacts',
        spaceID: happening.space.id,
        itemID: arg.id,
      };
      happeningBase = {
        ...happeningBase,
        related: arg.checked
          ? addRelatedItem(happeningBase.related, itemKey, {
              participant: {
                created: {
                  at: '' + new Date().toISOString(),
                  by: this.userService.currentUserID || '',
                },
              },
            })
          : removeRelatedItem(happeningBase.related, itemKey),
      };
    });

    happening = {
      ...happening,
      brief: {
        ...brief,
        ...happeningBase,
      },
      dbo: {
        ...dbo, // TODO: It does not make much sense to update DTO as brief should be enough?
        ...happeningBase,
      },
    };
    this.emitHappeningChange(happening);
  }

  protected $isAddingContact = signal(false);

  protected addContact(event: Event, source: string): void {
    this.analytics.logEvent('happening/participants/add_contact', { source });
    const spaceID = this.$spaceID();
    this.$isAddingContact.set(true);
    const happeningID = this.$happening().id;
    const componentProps: IContactSelectorProps = {
      space: this.$space(),
      okButtonLabel: 'Add',
    };
    this.contactSelectorService
      .selectMultipleContacts({
        title: 'Add participants',
        selectedItems: [],
        componentProps: componentProps,
        onSelected: (selectedContacts): Promise<void> => {
// console.log(
            `${selectedContacts?.length || 0} contacts select by user to be added as participants`,
          );
          return new Promise((resolve, reject) => {
            const existingContactIDs = this.$relatedContactIDs();
            const contactsToAdd = selectedContacts?.filter(
              (c) => !existingContactIDs?.includes(c.id),
            );
            if (contactsToAdd?.length) {
              const request: IHappeningContactsRequest = {
                spaceID,
                happeningID,
                contacts: contactsToAdd.map((c) => ({
                  id: c.id,
                })),
              };
              this.happeningService.addParticipants(request).subscribe({
                error: (err) => reject(err),
                next: () => {
// console.log(
                    `${contactsToAdd.length} contacts added as participants (api call completed)`,
                  );
                  const args: readonly ICheckChangedArgs[] =
                    request.contacts.map((c) => ({
                      event,
                      id: c.id,
                      checked: true,
                      resolve,
                      reject,
                    }));
                  this.addRemoveRelated(args);
                  resolve();
                },
              });
            } else {
// console.log('selected contacts already added as participants');
            }
          });
        },
      })
      .then((selectedContacts) => {
        this.$isAddingContact.set(false);
// console.log(
          `${selectedContacts?.length || 0} contacts added added as participants`,
        );
        // alert(
        // 	`${selectedContacts?.length || 0} contacts added added as participants`,
        // );
      })
      .catch((err) => {
        this.$isAddingContact.set(false);
        alert(err);
      });
  }
}
