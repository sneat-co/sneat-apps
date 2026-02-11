import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DatatugServicesStoreModule } from '../../../services/repo/datatug-services-store.module';

@Component({
  selector: 'sneat-datatug-my',
  templateUrl: './datatug-my-page.component.html',
  imports: [
    FormsModule,
    DatatugServicesStoreModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
  ],
})
export class DatatugMyPageComponent {}
