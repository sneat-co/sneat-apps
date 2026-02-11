import { Component, Input } from '@angular/core';
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
})
export class RetroFeedbackStageComponent {
  @Input({ required: true }) space: ISpaceContext = { id: '' };
  @Input({ required: true }) retrospective?: IRecord<IRetrospective>;

  public iAmReady?: boolean;

  public setReady(value: boolean) {
    this.iAmReady = value;
  }
}
