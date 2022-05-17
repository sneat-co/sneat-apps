import { Component, Input } from '@angular/core';

@Component({
	selector: 'sneat-names-form',
	templateUrl: './names-form.component.html',
})
export class NamesFormComponent {
	@Input() disabled = false;

	firstName = '';
	lastName = '';
}
