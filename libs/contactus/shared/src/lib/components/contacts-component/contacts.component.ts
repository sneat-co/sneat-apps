import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBadge,
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonList,
  IonRow,
  IonSegment,
  IonSegmentButton,
} from '@ionic/angular/standalone';
import { FilterItemComponent } from '@sneat/components';
import {
  addSpace,
  ContactRole,
  filterContactsByTextAndRole,
  IContactWithBrief,
  IContactWithCheck,
  IContactWithBriefAndSpace,
  IMemberGroupContext,
} from '@sneat/contactus-core';
import { defaultFamilyContactGroups } from '@sneat/contactus-services';
import { listItemAnimations } from '@sneat/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { ClassName, ISelectItem, SneatBaseComponent } from '@sneat/ui';
import { Observable } from 'rxjs';
import { IContactAddEventArgs } from '../contact-events';
import { ContactsByTypeComponent } from '../contacts-by-type';
import { ICheckChangedArgs } from '../contacts-checklist';
import { ContactsComponentCommand } from '../contacts-component.commands';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';
import { OptionalContactRoleIdAndBrief } from '../contact-forms/new-contact';

@Component({
  selector: 'sneat-contacts',
  templateUrl: './contacts.component.html',
  imports: [
    FormsModule,
    ContactsByTypeComponent,
    ContactsListItemComponent,
    FilterItemComponent,
    IonSegment,
    IonSegmentButton,
    IonIcon,
    IonLabel,
    IonBadge,
    IonCard,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonList,
    IonItemSliding,
  ],
  providers: [{ provide: ClassName, useValue: 'ContactsComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [listItemAnimations],
})
export class ContactsComponent extends SneatBaseComponent implements OnInit {
  public readonly $space = input.required<ISpaceContext>();

  public readonly $roleID = input<ContactRole | undefined>();
  protected readonly $role = signal<OptionalContactRoleIdAndBrief>(undefined);

  @Input() command?: Observable<ContactsComponentCommand>;

  @Output() readonly roleChange = new EventEmitter<undefined | ContactRole>();

  @Output() public readonly contactsChange = new EventEmitter<
    readonly IContactWithCheck[]
  >();

  @Input() goToNewContactPage = true;
  @Output() readonly addContactEvent = new EventEmitter<IContactAddEventArgs>();

  protected readonly $showTabs = computed(
    () => !this.$roleID() && this.$space().type === 'family',
  );

  protected readonly $filter = signal<string>('');

  protected onFilterChanged(filter: string): void {
    this.$filter.set(filter);
  }

  private readonly spaceNavService = inject(SpaceNavService);

  public readonly $allContacts = input.required<
    readonly IContactWithCheck[] | undefined
  >();

  protected readonly $contactsWithSpace = computed<
    readonly IContactWithBriefAndSpace[] | undefined
  >(() => {
    const contacts = this.$contacts();
    if (!contacts) {
      return undefined;
    }
    const space = this.$space();
    return contacts?.map(addSpace(space));
  });

  public constructor() {
    super();
  }

  protected readonly familyGroupDefinitions = defaultFamilyContactGroups;

  public segment: 'list' | 'groups' = 'groups';

  public groups: readonly IMemberGroupContext[] = [];

  public ngOnInit() {
    this.command?.pipe(this.takeUntilDestroyed()).subscribe((command) => {
      switch (command.name) {
        case 'new_contact':
          this.addNewContact(command.event).catch(
            this.errorLogger.logErrorHandler(
              'failed to navigate to new contact page',
            ),
          );
          break;
        case 'reset_selected':
          this.contactsChange.emit(
            this.$allContacts()?.map((c) =>
              Object.assign(c, { isChecked: false }),
            ),
          );
          break;
        case 'select_all':
          break;
      }
    });
  }

  private $contactsByRole = computed<
    Record<string, readonly IContactWithCheck[]>
  >(() => {
    const contacts = this.$allContacts() || [];
    const contactsByRole: Record<string, IContactWithBriefAndSpace[]> = {
      '': [],
    };
    const space = this.$space();
    contacts.forEach((c) => {
      const contact = { ...c, space };
      contactsByRole[''].push(contact);
      c.brief?.roles?.forEach((role) => {
        const roleContacts = contactsByRole[role as ContactRole];
        if (roleContacts) {
          roleContacts.push(contact);
        } else {
          contactsByRole[role] = [contact];
        }
      });
    });
    return contactsByRole;
  });

  readonly roles: readonly ISelectItem[] = [
    { id: '', title: 'All', iconName: 'people-outline' },
    { id: 'freight_agent', title: 'Agents', iconName: 'body-outline' },
    { id: 'buyer', title: 'Buyers', iconName: 'cash-outline' },
    { id: 'dispatcher', title: 'Dispatchers', iconName: 'business-outline' },
    { id: 'trucker', title: 'Truckers', iconName: 'bus-outline' },
    { id: 'shipping_line', title: 'Shipping lines', iconName: 'boat-outline' },
  ];

  protected $canAdd = computed<boolean>(() => {
    const role = this.$roleID();
    return role !== 'tenant' && role !== 'landlord';
  });

  public contactsNumber(role: string): number {
    const contactsByRole = this.$contactsByRole();
    const roleContacts = (contactsByRole && contactsByRole[role]) ?? [];
    return roleContacts?.length ?? 0;
  }

  protected $contacts = computed(() => {
    const allContacts = this.$allContacts();
    if (!allContacts) {
      return undefined;
    }
    const role = this.$roleID(),
      filter = this.$filter().trim().toLowerCase();

    const space = this.$space();

    return filterContactsByTextAndRole(allContacts, filter, role)?.map(
      addSpace(space),
    );
  });

  @Input() public contactClicked = (
    event: Event,
    contact: IContactWithBrief,
  ): void => {
    this.console.log(
      `ContactsComponent.contactClicked(contact{id=${contact.id})`,
    );
    event.stopPropagation();
    event.preventDefault();
    const space = this.$space();
    this.spaceNavService
      .navigateForwardToSpacePage(space, `contact/${contact.id}`, {
        state: { contact },
      })
      .catch(
        this.errorLogger.logErrorHandler('failed to navigate to contact page'),
      );
  };

  @Output() readonly addContactClick = new EventEmitter<IContactAddEventArgs>();

  protected readonly addNewContact = async (event: Event): Promise<void> => {
    event.stopPropagation();
    event.preventDefault();
    if (!this.goToNewContactPage) {
      const role = this.$role();
      this.addContactClick.emit({
        event,
        role,
      });
    }
    const space = this.$space();
    if (!space.id && !space.type) {
      return;
    }
    try {
      await this.spaceNavService.navigateForwardToSpacePage(
        space,
        'new-contact',
        { queryParams: this.$roleID() ? { role: this.$roleID() } : undefined },
      );
    } catch (err) {
      this.errorLogger.logError(err, 'failed to navigate to new contact page');
    }
  };

  protected contactSelectionChanged(args: ICheckChangedArgs) {
    this.contactsChange.emit(
      this.$allContacts()?.map((c) =>
        Object.assign(c, {
          isChecked: c.id === args.id ? args.checked : c.isChecked,
        }),
      ),
    );
  }

  protected goGroup(group: IMemberGroupContext): void {
    const space = this.$space();
    this.spaceNavService
      .navigateForwardToSpacePage(space, `group/${group.id}`, {
        state: {
          group: group,
        },
      })
      .catch(
        this.errorLogger.logErrorHandler(
          'failed to navigate to contact creation page',
        ),
      );
  }

  protected onRoleChanged(event: CustomEvent): void {
    event.stopPropagation();
    this.roleChange.emit(event.detail.value);
  }

  protected addGroup(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    alert('Not implemented yet');
  }
}
