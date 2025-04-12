import { Directive, EventEmitter, Output } from '@angular/core';
import { ContactFormBaseComponent } from '../contact-form-base.component';

@Directive()
export abstract class NewContactFormBaseComponent extends ContactFormBaseComponent {
	@Output() public readonly creatingChange = new EventEmitter<boolean>();
}
