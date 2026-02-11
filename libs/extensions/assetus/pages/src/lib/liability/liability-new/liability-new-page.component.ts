import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SpacePageBaseComponent } from '@sneat/space-components';
// import {CommuneBasePageParams} from 'sneat-shared/services/params';
// import {CommuneBasePage} from 'sneat-shared/pages/commune-base-page';

@Component({
  selector: 'sneat-liability-new',
  templateUrl: './liability-new-page.component.html',
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonList,
    IonCheckbox,
    IonButton,
  ],
})
export class LiabilityNewPageComponent extends SpacePageBaseComponent {
  protected liabilityType: 'income' | 'expense' = 'expense';
  protected assignedTo = 'members';
  protected period: 'weekly' | 'monthly' | 'yearly' = 'monthly';

  constructor() {
    super('LiabilityNewPageComponent');
  }
}
