import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { SpaceServiceModule } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { HappeningBasePage } from './happening-base-page';
import {
  HappeningComponentBaseParams,
  HappeningComponentBaseParamsModule,
  HappeningFormComponent,
  HappeningServiceModule,
} from '@sneat/extensions-schedulus-shared';

@Component({
  imports: [
    HappeningServiceModule,
    HappeningFormComponent,
    ContactusServicesModule,
    HappeningComponentBaseParamsModule,
    SpaceServiceModule,
    IonHeader,
    IonButtons,
    IonToolbar,
    IonMenuButton,
    IonBackButton,
    IonTitle,
    IonContent,
  ],
  providers: [{ provide: ClassName, useValue: 'HappeningPageComponent' }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sneat-happening-page',
  templateUrl: './happening-page.component.html',
})
export class HappeningPageComponent extends HappeningBasePage {
  public constructor() {
    super(inject(HappeningComponentBaseParams));
  }
}
