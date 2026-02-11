import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';

@Component({
  selector: 'sneat-intro',
  templateUrl: './intro.component.html',
  imports: [
    IonRow,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonCol,
  ],
})
export class IntroComponent {}
