import { Component, Input } from '@angular/core';
import { IAvatar } from '@sneat/auth-models';

@Component({
	selector: 'sneat-avatar',
	templateUrl: './avatar.component.html',
	standalone: false,
})
export class AvatarComponent {
	@Input() avatar?: IAvatar;
}
