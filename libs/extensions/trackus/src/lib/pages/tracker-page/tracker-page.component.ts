import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  SpaceComponentBaseParams,
  SpacePageBaseComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { distinctUntilChanged, map } from 'rxjs';
import { TrackerComponent } from '../../components';
import { TrackerProviderComponent } from '../../components/tracker/tracker-provider.component';
import { ITracker } from '../../dbo/i-tracker-dbo';
import { ClassName } from '@sneat/ui';

@Component({
  selector: 'sneat-tracker-page',
  imports: [
    TrackerComponent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonMenuButton,
    IonContent,
    SpaceServiceModule,
    TrackerProviderComponent,
  ],
  templateUrl: './tracker-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: ClassName,
      useValue: 'TrackerPageComponent',
    },
    SpaceComponentBaseParams,
  ],
})
export class TrackerPageComponent extends SpacePageBaseComponent {
  protected readonly $trackerID = signal<string | undefined>(undefined);
  protected readonly $tracker = signal<ITracker | undefined>(undefined);

  constructor() {
    super();
    this.route.paramMap
      .pipe(
        map((p) => p.get('trackerID')),
        distinctUntilChanged(),
      )
      .subscribe((trackerID) => {
        // console.log(`TrackerPageComponent.paramsMap => trackerID=` + trackerID);
        this.$trackerID.set(trackerID || undefined);
      });
  }
}
