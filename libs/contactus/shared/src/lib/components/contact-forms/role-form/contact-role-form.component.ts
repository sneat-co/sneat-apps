import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  signal,
  inject,
} from '@angular/core';
import { IonCard, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import { ClassName, SelectFromListComponent } from '@sneat/ui';
import { ContactGroupService } from '@sneat/contactus-services';
import { IIdAndDbo } from '@sneat/core';
import {
  ContactRole,
  IContactGroupDbo,
  IContactRoleWithIdAndBrief,
} from '@sneat/contactus-core';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
  selector: 'sneat-contact-role-form',
  templateUrl: './contact-role-form.component.html',
  imports: [SelectFromListComponent, IonCard, IonItemDivider, IonLabel],
  providers: [
    {
      provide: ClassName,
      useValue: 'ContactRoleFormComponent',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactRoleFormComponent extends SneatBaseComponent {
  public $contactGroupID = input.required<string | undefined>();

  protected $contactGroup = computed(() => {
    const id = this.$contactGroupID();
    const groups = this.$groups();
    const group = groups?.find((g) => g.id === id);
    this.contactGroupChange.emit(group);
    return group;
  });

  @Output() readonly contactGroupIDChange = new EventEmitter<
    string | undefined
  >();

  @Output() readonly contactGroupChange = new EventEmitter<
    IIdAndDbo<IContactGroupDbo> | undefined
  >();

  public readonly $contactRoleID = input.required<ContactRole | undefined>();

  @Output() readonly contactRoleIDChange = new EventEmitter<
    ContactRole | undefined
  >();

  @Output() readonly contactRoleChange = new EventEmitter<
    IContactRoleWithIdAndBrief | undefined
  >();

  protected readonly $groups = signal<
    readonly IIdAndDbo<IContactGroupDbo>[] | undefined
  >(undefined);

  protected readonly $groupItems = computed(() => {
    const groups = this.$groups();
    return (
      groups?.map((g) => ({
        id: g.id,
        title: g.dbo.title,
        emoji: g.dbo.emoji,
      })) || []
    );
  });

  protected readonly $roleItems = computed(() => {
    const group = this.$contactGroup();
    if (!group) {
      return [];
    }
    return group.dbo?.roles
      ?.filter((r) => r.id !== 'pet')
      ?.map((r) => ({
        id: r.id,
        title: r.brief.title,
        emoji: r.brief.emoji,
      }));
  });

  protected readonly roleBriefID = (o: IContactRoleWithIdAndBrief) => o.id;
  protected readonly groupID = (_: number, o: IIdAndDbo<IContactGroupDbo>) =>
    o.id;

  constructor() {
    super();
    const contactGroupService = inject(ContactGroupService);
    contactGroupService
      .getContactGroups()
      .pipe(this.takeUntilDestroyed())
      .subscribe({
        next: (groups) => {
          this.$groups.set(groups);
        },
      });
  }

  protected onContactGroupIDChanged(contactGroupID: string): void {
    // event.stopPropagation();
    this.contactGroupIDChange.emit(contactGroupID);
    const group = this.$groups()?.find((g) => g.id === contactGroupID);
    this.contactGroupChange.emit(group);
    this.clearContactType();
  }

  protected onContactRoleIDChanged(contactRoleID: string): void {
    this.contactRoleIDChange.emit(contactRoleID as ContactRole);
    const group = this.$contactGroup();
    const role = group?.dbo?.roles?.find((r) => r.id == contactRoleID);
    this.contactRoleChange.emit(role);
  }

  protected clearContactType(): void {
    this.contactRoleIDChange.emit(undefined);
  }
}
