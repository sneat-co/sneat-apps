import { Component, Input } from '@angular/core';

@Component({
	selector: 'sneat-shared-with',
	templateUrl: './shared-with.component.html',
	standalone: false,
})
export class SharedWithComponent {
	@Input() title?: string;
}
