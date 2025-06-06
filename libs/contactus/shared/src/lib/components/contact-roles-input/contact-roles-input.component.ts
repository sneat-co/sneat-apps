import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import { CONTACT_ROLES_BY_TYPE, IContactRole } from '@sneat/app';
import {
	ContactRole,
	ContactType,
	IContactWithBrief,
} from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/space-models';
import { MultiSelectorComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-contact-roles-input',
	templateUrl: './contact-roles-input.component.html',
	imports: [MultiSelectorComponent],
})
export class ContactRolesInputComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly contactService = inject(ContactService);
	private readonly contactRolesByType = inject<
		Record<ContactType, IContactRole[]>
	>(CONTACT_ROLES_BY_TYPE);

	@Input({ required: true }) space?: ISpaceContext;
	@Input() contact?: IContactWithBrief;
	// @Output() readonly rolesChange = new EventEmitter<ContactRole[]>();

	protected roles?: IContactRole[];
	protected processingRoleIDs: ContactRole[] = [];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contact']) {
			this.setRoles();
		}
	}

	private setRoles(): void {
		this.roles =
			this.contact?.brief?.type && this.contactRolesByType
				? this.contactRolesByType[this.contact.brief.type]
				: undefined;
	}

	// onRoleChanged(event: Event, role: IContactRole): void {
	// 	console.log('onRoleChanged', role, event);
	// 	if (!this.space || !this.contact) {
	// 		alert('space or contact is not set');
	// 		return;
	// 	}
	// 	const checked = (event.target as HTMLInputElement).checked;
	// 	const request: IUpdateContactRequest = {
	// 		contactID: this.contact.id,
	// 		spaceID: this.space?.id,
	// 		roles: {
	// 			add: checked ? [role.id] : undefined,
	// 			remove: checked ? undefined : [role.id],
	// 		},
	// 	};
	// 	this.processingRoleIDs.push(role.id);
	// 	const complete = () =>
	// 		(this.processingRoleIDs = this.processingRoleIDs.filter(
	// 			(id) => id !== role.id,
	// 		));
	// 	this.contactService.updateContact(request).subscribe({
	// 		error: (err: unknown) => {
	// 			console.log('setContactRole error', err);
	// 			this.errorLogger.logError(err, 'failed to set contact role');
	// 			complete();
	// 			this.setRoles();
	// 			event.preventDefault();
	// 		},
	// 		complete,
	// 	});
	// }
}
