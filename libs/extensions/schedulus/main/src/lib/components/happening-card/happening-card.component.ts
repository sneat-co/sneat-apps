import { json } from '@angular-devkit/core';
import { Component } from '@angular/core';
import {
	HappeningBaseComponent,
	HappeningComponent,
} from '../happening-base.component';

@Component({
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
	styleUrls: ['happening-card.component.scss'],
	providers: [...HappeningBaseComponent.providers],
	...HappeningBaseComponent.metadata,
})
export class HappeningCardComponent extends HappeningComponent {
	protected readonly json = json;
}
