import { Component, Input } from '@angular/core';
import { Message } from '../services/data.service';

@Component({
	selector: 'sneat-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
	@Input() message: Message | undefined;

	isIos() {
		const win = window as any;
		return win && win.Ionic && win.Ionic.mode === 'ios';
	}
}
