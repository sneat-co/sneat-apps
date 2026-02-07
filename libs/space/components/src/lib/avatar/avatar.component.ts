import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IAvatar } from '@sneat/auth-models';

@Component({
	selector: 'sneat-avatar',
	templateUrl: './avatar.component.html',
	imports: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
	@Input({ required: true }) avatar?: IAvatar;
}
