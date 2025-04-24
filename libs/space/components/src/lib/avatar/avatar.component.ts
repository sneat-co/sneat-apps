import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonImg } from '@ionic/angular/standalone';
import { IAvatar } from '@sneat/auth-models';

@Component({
	selector: 'sneat-avatar',
	templateUrl: './avatar.component.html',
	imports: [
		IonImg,
		// IonicModule, // TODO(help-wanted): For some reason this fails: import { IonImg } from '@ionic/angular/standalone';
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
	@Input({ required: true }) avatar?: IAvatar;
}
