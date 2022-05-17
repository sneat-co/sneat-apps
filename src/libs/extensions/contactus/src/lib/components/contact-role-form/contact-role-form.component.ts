import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactRole } from '@sneat/dto';
import { IContactGroupDto, defaultContactGroups } from '../../contact-group.service';
import { IContactGroupWithContacts } from '../../pages/contacts/ui-types';



@Component({
	selector: 'sneat-contact-role-form',
	templateUrl: './contact-role-form.component.html',
})
export class ContactRoleFormComponent {
	@Input() public groupID?: string = 'kid';
	@Input() contactType?: ContactRole;
	@Output() readonly contactTypeChange = new EventEmitter<ContactRole|undefined>();

	get group(): IContactGroupWithContacts | undefined {
		return this.groups.find(g => g.id === this.groupID);
	}

	readonly groups: IContactGroupWithContacts[] = defaultContactGroups;

	readonly id = (_: number, v: { id: string }) => v.id;

	emitChanged(): void {
		this.contactTypeChange.emit(this.contactType);
	}

	clearContactType(): void {
		this.contactType = undefined
		this.emitChanged();
	}
}
