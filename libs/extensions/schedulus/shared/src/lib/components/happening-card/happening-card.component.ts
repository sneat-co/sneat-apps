import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/angular/standalone';
import { LongMonthNamePipe } from '@sneat/components';
import { IContactWithBrief } from '@sneat/contactus-core';
import { SelectedContactsPipe } from '@sneat/contactus-shared';
import { getRelatedItemIDs } from '@sneat/dto';
import { WdToWeekdayPipe } from '@sneat/mod-schedulus-core';
import { ClassName } from '@sneat/ui';
import { HappeningBaseComponent } from '../happening-base.component';
import { IHappeningContactRequest } from '../../services/happening.service';
import { HappeningSlotsComponent } from '../happening-slots/happening-slots.component';
import { ContactsAsBadgesComponent } from '@sneat/contactus-shared';

@Component({
  styleUrls: ['happening-card.component.scss'],
  providers: [
    { provide: ClassName, useValue: 'HappeningCardComponent' },
    ...HappeningBaseComponent.providers,
  ],
  ...HappeningBaseComponent.metadata,
  imports: [
    IonText,
    WdToWeekdayPipe,
    IonLabel,
    IonCard,
    IonItem,
    IonButtons,
    IonButton,
    IonIcon,
    HappeningSlotsComponent,
    ContactsAsBadgesComponent,
    LongMonthNamePipe,
    SelectedContactsPipe,
    SelectedContactsPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-happening-card',
  templateUrl: 'happening-card.component.html',
})
export class HappeningCardComponent extends HappeningBaseComponent {
  protected readonly $relatedContactIDs = computed(() => {
    const happening = this.$happening();
    if (!happening) {
      return [];
    }
    return getRelatedItemIDs(
      happening.dbo?.related || happening.brief?.related,
      'contactus',
      'contacts',
    );
  });

  protected readonly $hasRelatedContacts = computed<boolean>(
    () => !!this.$relatedContactIDs()?.length,
  );

  public constructor() {
    super();
  }

  protected removeContact(contact: IContactWithBrief): void {
    console.log('removeContact()', contact);
    const [space, happening] = this.spaceAndHappening();
    if (!space || !happening) {
      return;
    }
    const request: IHappeningContactRequest = {
      spaceID: space.id,
      happeningID: happening.id,
      contact: { id: contact.id },
    };
    this.happeningService.removeParticipant(request).subscribe({
      next: () => {
        this.changeDetectorRef.markForCheck();
      },
      error: this.errorLogger.logErrorHandler(
        'Failed to remove member from happening',
      ),
    });
  }
}
