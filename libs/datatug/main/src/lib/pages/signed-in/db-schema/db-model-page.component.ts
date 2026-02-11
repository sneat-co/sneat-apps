import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SneatCardListComponent } from '@sneat/components';
import { IProjDbModelBrief } from '../../../models/definition/project';

@Component({
  selector: 'sneat-datatug-db-schema',
  templateUrl: './db-model-page.component.html',
  imports: [
    FormsModule,
    SneatCardListComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonBackButton,
    IonContent,
    IonTitle,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonInput,
    IonBadge,
    IonItemDivider,
    IonIcon,
    IonText,
    IonButton,
  ],
})
export class DbModelPageComponent {
  public dbModelBrief?: IProjDbModelBrief;
  public tab: 'tables' | 'views' | 'sp' = 'tables';
  public envTab = 'sit';
  public envs = ['dev', 'sit', 'prod'];

  constructor() {
    this.dbModelBrief = history.state['dbmodel'];
  }
}
