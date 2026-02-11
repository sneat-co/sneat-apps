import { Component, inject } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { ContactService } from '@sneat/contactus-services';
import { MemberBasePage } from '../member-base-page';

@Component({
  selector: 'sneat-member-contacts',
  templateUrl: './member-contacts-page.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
  ],
})
export class MemberContactsPageComponent extends MemberBasePage {
  public override segment: 'friends' | 'other' = 'friends';

  constructor() {
    super(inject(ContactService));
  }
}
