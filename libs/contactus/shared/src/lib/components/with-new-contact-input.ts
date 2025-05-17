import { Directive, EventEmitter, input, Output } from '@angular/core';
import { NewContactBaseDboAndSpaceRef } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-services';

@Directive()
export class WithNewContactInput extends WithSpaceInput {
	public readonly $contact = input.required<NewContactBaseDboAndSpaceRef>();
	@Output() readonly contactChange =
		new EventEmitter<NewContactBaseDboAndSpaceRef>();

	constructor(className: string) {
		super(className);
	}
}
