import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnDestroy,
  signal,
  inject,
} from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  ContactsComponent,
  ContactsComponentCommand,
  ContactsComponentCommandName,
} from '@sneat/contactus-shared';
import { setHrefQueryParam } from '@sneat/core';
import {
  addSpace,
  ContactRole,
  IContactWithCheck,
} from '@sneat/contactus-core';
import {
  SpacePageTitleComponent,
  SpaceItemsBaseComponent,
} from '@sneat/space-components';
import {
  ContactusServicesModule,
  ContactusSpaceService,
} from '@sneat/contactus-services';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { Subject } from 'rxjs';

@Component({
  imports: [
    SpacePageTitleComponent,
    ContactusServicesModule,
    SpaceServiceModule,
    ContactsComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButtons,
    IonButton,
    IonBackButton,
    IonTitle,
    IonIcon,
    IonFooter,
    IonLabel,
    IonContent,
    IonMenuButton,
  ],
  providers: [{ provide: ClassName, useValue: 'ContactsPageComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-contacts-page',
  templateUrl: './contacts-page.component.html',
})
export class ContactsPageComponent
  extends SpaceItemsBaseComponent
  implements OnDestroy
{
  private readonly contactusSpaceService = inject(ContactusSpaceService);

  protected readonly $allContacts = signal<
    undefined | readonly IContactWithCheck[]
  >(undefined);

  // public readonly $filter = signal<string>('');
  public readonly $role = signal<ContactRole | undefined>(undefined);

  protected $pageTitle = computed(() => {
    const role = this.$role();
    if (role) {
      return `${role.toUpperCase() + role.substr(1)}s`;
    }
    return 'Contacts';
  });

  protected readonly $selectedContacts = computed(() =>
    this.$allContacts()?.filter((c) => c.isChecked),
  );

  constructor() {
    super('');
    const role = location.pathname.match(/(applicant|landlord|tenant)/);
    if (role) {
      this.$role.set(role[1] as ContactRole);
    }

    // const allContacts = window.history.state.contacts as IContactWithSpace[];
    // if (allContacts) {
    // 	this.$allContacts.set(allContacts);
    // }

    this.route.queryParamMap.pipe(this.takeUntilDestroyed()).subscribe({
      next: (q) => {
        this.$role.set((q.get('role') as ContactRole) || undefined);
      },
    });
    this.spaceIDChanged$.subscribe({
      next: (spaceID) => {
        if (!spaceID) {
          return;
        }
        this.contactusSpaceService
          .watchContactBriefs(this.space.id)
          .pipe(this.takeUntilDestroyed(), this.takeUntilSpaceIdChanged())
          .subscribe({
            next: (contacts) => {
              const space = this.$space();
              if (space.id !== spaceID) {
                return;
              }
              this.setSpaceContacts(contacts.map(addSpace(space)) || []);
            },
          });
      },
    });
  }

  protected $titleIcon = computed(() => {
    switch (this.$role()) {
      case 'tenant':
        return '🤠';
      case 'landlord':
        return '🤴';
      case 'applicant':
        return '🤔';
      default:
        return '📇';
    }
  });

  private readonly setSpaceContacts = (contacts: IContactWithCheck[]): void => {
    this.$allContacts.set(contacts);
  };

  protected onRoleChanged(role?: ContactRole): void {
    this.$role.set(role);
    const url = setHrefQueryParam('role', role || '');
    history.replaceState(undefined, document.title, url);
  }

  protected readonly command = new Subject<ContactsComponentCommand>();

  protected sendCommand(
    event: Event,
    name: ContactsComponentCommandName,
  ): void {
    this.command.next({ name, event });
  }

  public override ngOnDestroy(): void {
    this.command.complete();
    super.ngOnDestroy();
  }
}
