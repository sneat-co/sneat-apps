import {Component, Input} from '@angular/core';

@Component({
	selector: 'datatug-error-card',
	templateUrl: './sneat-error-card.component.html',
	styleUrls: ['./sneat-error-card.component.scss'],
})
export class SneatErrorCardComponent {

	@Input()
	error: any;
}
