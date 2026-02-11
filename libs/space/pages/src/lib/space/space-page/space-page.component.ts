import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  signal,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonRouterLinkWithHref,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular/standalone';
import { IContactusSpaceDbo } from '@sneat/contactus-core';
import {
  ContactusNavService,
  ContactusServicesModule,
  ContactusSpaceContextService,
} from '@sneat/contactus-services';
import { MembersShortListCardComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo, TopMenuService } from '@sneat/core';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { SpacePageBaseComponent } from './SpacePageBaseComponent';
import { CalendarBriefComponent } from '@sneat/extensions-schedulus-shared';

@Component({
  imports: [
    FormsModule,
    ContactusServicesModule,
    SpaceServiceModule,
    MembersShortListCardComponent,
    CalendarBriefComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonText,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonButton,
    IonCard,
    IonContent,
    AsyncPipe,
    TitleCasePipe,
    RouterLink,
    TitleCasePipe,
    SpaceServiceModule,
    IonRouterLinkWithHref,
  ],
  providers: [
    { provide: ClassName, useValue: 'SpacePageComponent' },
    ContactusNavService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-space-page',
  templateUrl: './space-page.component.html',
})
export class SpacePageComponent extends SpacePageBaseComponent {
  protected readonly $contactusSpace = signal<
    IIdAndOptionalDbo<IContactusSpaceDbo> | undefined
  >(undefined);

  protected readonly $showMembers = computed(() => {
    const spaceType = this.$spaceType();
    return spaceType === 'family' || spaceType === 'team';
  });

  constructor() {
    const topMenuService = inject(TopMenuService);
    const cd = inject(ChangeDetectorRef);

    super(topMenuService, cd);
    new ContactusSpaceContextService(
      this.destroyed$,
      this.spaceIDChanged$,
    ).contactusSpaceContext$.subscribe(this.$contactusSpace?.set);
  }
}
