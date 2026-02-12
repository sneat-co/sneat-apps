import { Component, ViewChild } from '@angular/core';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SpacesCardComponent } from '@sneat/space-components';

@Component({
  selector: 'sneat-spaces-page',
  templateUrl: 'spaces-page.component.html',
  imports: [
    SpacesCardComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonContent,
    IonMenuButton,
    IonFab,
    IonFabButton,
    IonIcon,
  ],
})
export class SpacesPageComponent {
  @ViewChild(SpacesCardComponent) spacesCard?: SpacesCardComponent;

  protected onCreateSpaceClick(): void {
    this.spacesCard?.startAddingSpace();
  }
}
