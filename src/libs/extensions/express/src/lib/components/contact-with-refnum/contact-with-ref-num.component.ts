import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactRole, ContactType } from '@sneat/dto';
import { IContactContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto';

@Component({
	selector: 'sneat-contact-with-refnum',
	templateUrl: './contact-with-ref-num.component.html',
})
export class ContactWithRefNumComponent {
	@Input() readonly = false;
	@Input() contactColSize = 8;
	@Input() order?: IExpressOrderContext;
	@Input() contact?: IContactContext;
	@Input() contactType?: ContactType;
	@Input() contactRole?: ContactRole;
	@Output() contactChange = new EventEmitter<IContactContext>();
	@Input() refNumber = '';
	@Output() refNumberChange = new EventEmitter<string>();

	get refNumberColSize(): number {
		return 12 - this.contactColSize;
	}

	onRefNumberChange(): void {
		this.refNumberChange.emit(this.refNumber);
	}
}
