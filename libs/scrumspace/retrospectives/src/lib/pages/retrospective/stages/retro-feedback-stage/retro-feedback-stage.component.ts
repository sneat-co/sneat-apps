import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonCheckbox, IonItem, IonLabel } from '@ionic/angular/standalone';
import { IRecord } from '@sneat/data';
import { IRetrospective } from '@sneat/ext-scrumspace-scrummodels';
import { ISpaceContext } from '@sneat/space-models';
import { MyRetroItemsComponent } from '../../../../components/my-retro-items/my-retro-items.component';
import { RetroMembersComponent } from '../../retro-members/retro-members.component';

@Component({
  selector: 'sneat-retro-feedback-stage',
  templateUrl: './retro-feedback-stage.component.html',
  imports: [
    MyRetroItemsComponent,
    IonItem,
    IonCheckbox,
    IonLabel,
    RetroMembersComponent,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetroFeedbackStageComponent {
  readonly space = input<ISpaceContext>({ id: '' });
  readonly retrospective = input<IRecord<IRetrospective>>();

  public readonly iAmReady = signal<boolean | undefined>(undefined);

  public setReady(value: boolean) {
    this.iAmReady.set(value);
  }
}
