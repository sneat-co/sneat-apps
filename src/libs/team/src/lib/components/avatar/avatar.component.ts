import {Component, Input} from '@angular/core';
import {IAvatar} from '@sneat/auth-models';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent {
  @Input() avatar: IAvatar;
}
