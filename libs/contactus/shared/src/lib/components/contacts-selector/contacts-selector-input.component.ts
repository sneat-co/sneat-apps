import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  signal,
  inject,
} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import {
  addSpace,
  IContactusSpaceDboAndID,
  IContactWithBrief,
  IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { ContactTitlePipe } from '../../pipes';
import { ContactsListComponent } from '../contacts-list';
import { ContactsAsBadgesComponent } from '../members-as-badges';
import { IContactSelectorOptions } from './contacts-selector.interfaces';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsSelectorService } from './contacts-selector.service';

@Component({
  selector: 'sneat-contacts-selector-input',
  templateUrl: 'contacts-selector-input.component.html',
  imports: [
    ContactsListComponent,
    ContactTitlePipe,
    ContactsAsBadgesComponent,
    IonItemGroup,
    IonItemDivider,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonItem,
    IonSelect,
    IonSelectOption,
  ],
})
export class ContactsSelectorInputComponent {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly contactsSelectorService = inject(ContactsSelectorService);

  // TODO: Is it duplicate of ContactInputComponent?
  protected readonly $contactusSpace = signal<
    IContactusSpaceDboAndID | undefined
  >(undefined);

  public readonly $space = input.required<ISpaceContext>();
  public readonly $contacts = input.required<
    readonly IContactWithBrief[] | undefined
  >();
  protected readonly $contactsWithSpace = computed(() => {
    const space = this.$space();
    return this.$contacts()?.map(addSpace(space));
  });
  public readonly $selectedContacts =
    input.required<readonly IContactWithBriefAndSpace[]>();

  public readonly $hasSelectedContacts = computed(
    () => !!this.$selectedContacts().length,
  );

  public readonly $max = input<number | undefined>(undefined);

  @Output() readonly selectedContactsChange = new EventEmitter<
    readonly IContactWithBriefAndSpace[]
  >();

  @Output() readonly removeMember = new EventEmitter<IContactWithBrief>();

  get selectedContactID(): string | undefined {
    const selectedContacts = this.$selectedContacts();
    return (selectedContacts.length && selectedContacts[0].id) || undefined;
  }

  protected selectContacts(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    const space = this.$space();
    const contactusSpace = this.$contactusSpace();
    if (!contactusSpace || !space) {
      return;
    }
    const options: IContactSelectorOptions = {
      selectedItems: this.$selectedContacts(),
      // items: from(
      // 	zipMapBriefsWithIDs(contactusSpace.dbo?.contacts)?.map((m) =>
      // 		contactContextFromBrief(m, space),
      // 	),
      // ),
      max: this.$max(),
    };
    this.contactsSelectorService
      .selectMultipleContacts(options)
      .then((selectedContacts) => {
        // this.$selectedContacts.set( selectedContacts || []);
        this.selectedContactsChange.emit(selectedContacts || []);
      })
      .catch(
        this.errorLogger.logErrorHandler('Failed to select members in modal'),
      );
  }

  onRemoveMember(member: IContactWithBrief): void {
    this.removeMember.emit(member);
  }

  onSelectedMembersChanged(
    members: readonly IContactWithBriefAndSpace[],
  ): void {
// console.log('onSelectedMembersChanged()', members);
    this.selectedContactsChange.emit(members);
  }

  clear(): void {
    // this.selectedContacts = [];
    this.selectedContactsChange.emit([]);
  }
}
