import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  IonChip,
  IonIcon,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import {
  IContactWithBrief,
  IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { PersonTitle } from '../../pipes';

interface IContactWithState extends IContactWithBriefAndSpace {
  readonly isDeleting?: boolean;
}

@Component({
  imports: [PersonTitle, IonChip, IonLabel, IonIcon, IonSpinner, PersonTitle],
  styles: ['.deleting {text-decoration: line-through}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-contacts-as-badges',
  templateUrl: 'contacts-as-badges.component.html',
})
export class ContactsAsBadgesComponent {
  private readonly $deletingContactIDs = signal<readonly string[]>([]);

  public readonly $contacts =
    input.required<readonly IContactWithBriefAndSpace[]>();

  protected readonly $contactsWithState = computed<
    readonly IContactWithState[]
  >(() => {
    const deletingContactIDs = this.$deletingContactIDs();
    const result: readonly IContactWithState[] = this.$contacts().map((c) =>
      Object.assign(c, { isDeleting: deletingContactIDs.includes(c.id) }),
    );
    if (deletingContactIDs.some((id) => result.some((c) => c.id === id))) {
      this.$deletingContactIDs.update((deletingContactIDs) =>
        deletingContactIDs.filter((id) => result.some((c) => c.id === id)),
      );
    }
    return result;
  });

  @Input() color:
    | 'primary'
    | 'light'
    | 'dark'
    | 'medium'
    | 'secondary'
    | 'tertiary' = 'light';

  @Input() showDelete = false;

  @Output() readonly deleteContact = new EventEmitter<IContactWithBrief>();

  protected delete(event: Event, member: IContactWithBrief): void {
    event.stopPropagation();
    this.$deletingContactIDs.update((ids) => [...ids, member.id]);
    this.deleteContact.emit(member);
  }
}
