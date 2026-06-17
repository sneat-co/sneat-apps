import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { IScrumDbo } from '@sneat/ext-scrumspace-scrummodels';

@Component({
  selector: 'sneat-timer-meeting-button',
  templateUrl: './timer-meeting-button.component.html',
  imports: [IonButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerMeetingButtonComponent {
  public readonly scrumID = input<string>();
  public readonly scrum = input<IScrumDbo>();
  public readonly spaceID = input<string>();
}
