import { Component } from '@angular/core';
import { DataService, Message } from '../services/data.service';

@Component({
	selector: 'sneat-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
})
export class HomePage {
	constructor(private data: DataService) {}

	refresh(ev: Event) {
		if (ev instanceof CustomEvent) {
			setTimeout(() => ev.detail.complete(), 3000);
		}
	}

	getMessages(): Message[] {
		return this.data.getMessages();
	}
}
