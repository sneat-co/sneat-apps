import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { SpaceBaseComponent } from '@sneat/space-components';
import { NewTrackerFormComponent } from '../../components/new-tracker/new-tracker-form.component';
import { ClassName } from '@sneat/ui';

@Component({
  selector: 'sneat-new-tracker',
  templateUrl: './new-tracker-page.component.html',
  imports: [
    NewTrackerFormComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonMenuButton,
    IonContent,
    IonCard,
  ],
  providers: [
    {
      provide: ClassName,
      useValue: 'NewTrackerPageComponent',
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTrackerPageComponent extends SpaceBaseComponent {
  protected readonly $category = signal<string>('');

  constructor() {
    super();
    this.route.queryParamMap.subscribe((paramMap) => {
      const category = paramMap.get('category');
      if (category) {
        this.$category.set(category);
      }
    });
  }
}
