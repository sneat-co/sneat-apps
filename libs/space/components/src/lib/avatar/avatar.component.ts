import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { IAvatar } from '@sneat/auth-models';

@Component({
  selector: 'sneat-avatar',
  templateUrl: './avatar.component.html',
  imports: [IonImg],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
  @Input({ required: true }) avatar?: IAvatar;
}
