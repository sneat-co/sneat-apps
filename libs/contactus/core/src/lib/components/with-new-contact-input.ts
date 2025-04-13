import { Directive, EventEmitter, input, Output } from '@angular/core';
import { NewContactBaseDboAndSpaceRef } from '../contexts/contact-context';
import { SneatBaseComponent } from '@sneat/ui';

@Directive()
export class WithNewContactInput extends SneatBaseComponent {
	public readonly $contact = input.required<NewContactBaseDboAndSpaceRef>();
	@Output() readonly contactChange =
		new EventEmitter<NewContactBaseDboAndSpaceRef>();
}
