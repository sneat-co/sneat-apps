import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'sneat-datatug-tags',
  templateUrl: './tags-page.component.html',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class TagsPageComponent {}
