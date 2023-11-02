import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';
import { IContactContext } from '@sneat/team-models';
import { ILogistOrderContext } from '../../dto';

@Component({
	selector: 'sneat-contact-with-ref-num',
	templateUrl: './contact-with-ref-num.component.html',
})
export class ContactWithRefNumComponent {
	@Input() readonly = false;
	@Input() contactColSize = 8;
	@Input() order?: ILogistOrderContext;
	@Input() contactType?: ContactType;
	@Input() contactRole?: ContactRole;

	@Input() contact?: IContactContext;
	@Output() readonly contactChange = new EventEmitter<
		undefined | IContactContext
	>();

	@Input() refNumber = '';
	@Output() readonly refNumberChange = new EventEmitter<string>();

	get refNumberColSize(): number {
		return 12 - this.contactColSize;
	}

	protected onRefNumberChange(): void {
		this.refNumberChange.emit(this.refNumber);
	}

	protected onContactChanged(contact?: IContactContext): void {
		this.contactChange.emit(contact);
	}
}
