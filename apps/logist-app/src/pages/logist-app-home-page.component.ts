import { Component } from '@angular/core';
import {
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'sneat-logist-app-home-page',
  templateUrl: 'logist-app-home-page.component.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonCard,
  ],
})
export class LogistAppHomePageComponent {}
