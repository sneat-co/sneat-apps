import { Component, Input } from '@angular/core';

@Component({
	selector: 'sneat-datatug-error-card',
	templateUrl: './sneat-error-card.component.html',
})
export class SneatErrorCardComponent {
	@Input()
	error?: {message?: string};
}
