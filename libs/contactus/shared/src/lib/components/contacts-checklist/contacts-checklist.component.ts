import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { ContactusSpaceService } from '@sneat/contactus-services';
import {
  addSpace,
  IContactWithBrief,
  IContactWithCheck,
} from '@sneat/contactus-core';
import {
  computeSpaceIdFromSpaceRef,
  computeSpaceRefFromSpaceContext,
  ISpaceContext,
} from '@sneat/space-models';
import { ClassName, SneatBaseComponent } from '@sneat/ui';
import { Subscription } from 'rxjs';
import { ContactsChecklistItemComponent } from './contacts-checklist-item.component';

export interface ICheckChangedArgs {
  event: Event;
  id: string;
  checked: boolean;
  resolve: () => void;
  reject: (reason?: unknown) => void;
}

@Component({
  selector: 'sneat-contacts-checklist',
  templateUrl: './contacts-checklist.component.html',
  imports: [ContactsChecklistItemComponent, IonItem, IonLabel],
  providers: [
    {
      provide: ClassName,
      useValue: 'ContactsChecklistComponent',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsChecklistComponent extends SneatBaseComponent {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly contactusSpaceService = inject(ContactusSpaceService);

  public readonly $lastItemLine = input<
    undefined | 'full' | 'none' | 'inset'
  >();

  public readonly $spaceRoles = input<readonly string[]>(['member']);
  public readonly $spaceRolesToExclude = input<undefined | readonly string[]>();
  public readonly $onlySelected = input<boolean>(false);
  public readonly $checkedContactIDs = input.required<
    readonly string[] | undefined
  >();

  protected readonly $checkedContactIDsOfSpace = computed(() => {
    const suffix = '@' + this.$spaceID();
    const checkedContactIDs = this.$checkedContactIDs();
    return checkedContactIDs
      ?.filter((id) => !id.includes('@') || id.endsWith(suffix))
      .map((id) => (id.includes('@') ? id.slice(0, -suffix.length) : id));
  });

  public readonly $space = input.required<ISpaceContext>();
  protected readonly $spaceRef = computeSpaceRefFromSpaceContext(this.$space);
  protected readonly $spaceID = computeSpaceIdFromSpaceRef(this.$spaceRef);

  space?: ISpaceContext;
  @Input() roles: string[] = ['member'];

  @Input() noContactsMessage = 'No members found';

  @Output() readonly checkedChange = new EventEmitter<ICheckChangedArgs>();

  private contactusSpaceSubscription?: Subscription;

  protected readonly $spaceContacts = signal<IContactWithBrief[] | undefined>(
    undefined,
  );

  protected readonly $contactsToDisplay = computed<
    undefined | readonly IContactWithCheck[]
  >(() => {
    const contacts = this.$spaceContacts(),
      roles = this.$spaceRoles(),
      rolesToExclude = this.$spaceRolesToExclude(),
      onlySelected = this.$onlySelected(),
      checkedInProgress = this.$checkedInProgress(),
      uncheckedInProgress = this.$uncheckedInProgress(),
      checkedContactIDs = this.$checkedContactIDsOfSpace();

    const isSelected = (contactID: string) =>
      !uncheckedInProgress.includes(contactID) &&
      (checkedContactIDs?.includes(contactID) ||
        checkedInProgress.includes(contactID));

    const hasIncludedRole = roles.length
      ? (c: IContactWithBrief) => roles.some((r) => c.brief?.roles?.includes(r))
      : () => true;

    const hasExcludedRole = rolesToExclude
      ? (c: IContactWithBrief) =>
          rolesToExclude.some((r) => c.brief?.roles?.includes(r))
      : () => false;

    if (!contacts) {
      return undefined;
    }
// console.log(
      'ContactsChecklistComponent.subscribeForContactBriefs() =>',
      contacts,
      roles,
      rolesToExclude,
    );

    const spaceRef = this.$spaceRef();

    return contacts
      .filter((c) => hasIncludedRole(c) && !hasExcludedRole(c))
      .map((c) => ({
        id: c.id,
        brief: c.brief,
        isChecked: isSelected(c.id),
      }))
      .filter((c) => !onlySelected || c.isChecked)
      .map(addSpace(spaceRef));
  });

  protected readonly contactID = (_: number, contact: IContactWithBrief) =>
    contact.id;

  constructor() {
    super();
    effect(() => {
      const spaceID = this.$spaceID();
      this.contactusSpaceSubscription?.unsubscribe();
      if (spaceID) {
        this.subscribeForContactBriefs(this.$spaceID());
      }
    });
  }

  private subscribeForContactBriefs(spaceID: string): void {
// console.log(
      `ContactsChecklistComponent.subscribeForContactBriefs(spaceID=${spaceID})`,
    );
    this.contactusSpaceSubscription = this.contactusSpaceService
      .watchContactBriefs(spaceID)
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (contacts) => {
          this.$spaceContacts.set(contacts);
        },
      });
  }

  protected readonly $checkedInProgress = signal<readonly string[]>([]);
  protected readonly $uncheckedInProgress = signal<readonly string[]>([]);

  protected onCheckboxChange(event: Event, contact: IContactWithBrief): void {
    const ce = event as CustomEvent;
    const cID = contact.id;
// console.log('onCheckboxChange()', ce);
    const checked = !!ce.detail.checked;
    if (checked) {
      if (!this.$checkedInProgress().includes(cID)) {
        this.$checkedInProgress.update((v) => [...v, cID]);
      }
    } else if (!this.$uncheckedInProgress().includes(cID)) {
      this.$uncheckedInProgress.update((v) => [...v, cID]);
    }
    const clearInProgress = () => {
// console.log('clearInProgress()', cID, checked);
      if (checked) {
        this.$checkedInProgress.update((v) => v.filter((id) => id !== cID));
      } else {
        this.$uncheckedInProgress.update((v) => v.filter((id) => id !== cID));
      }
      this.changeDetectorRef.markForCheck();
    };
    new Promise<void>((resolve, reject) => {
      this.checkedChange.emit({
        event: ce,
        id: cID,
        checked,
        resolve,
        reject,
      });
    })
      .then(clearInProgress)
      .catch((err) => {
        this.errorLogger.logError(err);

        // Restore checkbox state with a delay
        // to allow users to see that check change was registered and processed
        setTimeout(clearInProgress, 500);
      });
  }
}
