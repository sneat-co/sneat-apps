import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { UserAuthAccountsComponent } from '@sneat/auth-ui';
import { UserCountryComponent } from '@sneat/components';
import { ContactusServicesModule } from '@sneat/contactus-services';
import { BetaFlagsComponent } from './beta-flags.component';

@Component({
  selector: 'sneat-user-my--profile-page',
  templateUrl: 'user-my-profile-page.component.html',
  imports: [
    UserCountryComponent,
    ContactusServicesModule,
    UserAuthAccountsComponent,
    FormsModule,
    BetaFlagsComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
  ],
})
export class UserMyProfilePageComponent {
  protected tab: 'authentication' | 'beta_testing' = 'authentication';

  constructor() {
    // console.log('UserMyPageComponent.constructor()');
  }
}
