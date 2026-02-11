import { Component } from '@angular/core';
import {
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
} from '@ionic/angular/standalone';
import { buildInfo } from './build-info';

@Component({
  selector: 'sneat-app-version',
  templateUrl: 'app-version.component.html',
  imports: [IonItemDivider, IonLabel, IonItem, IonInput],
})
export class AppVersionComponent {
  protected readonly buildInfo = buildInfo;
}
