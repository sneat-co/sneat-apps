import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CONTACT_ROLES_BY_TYPE, IContactRole } from '@sneat/app';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ContactService, ISetContactRoleRequest } from '@sneat/contactus-services';
import { IContactContext, ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-contact-roles-input',
	templateUrl: './contact-roles-input.component.html',
})
export class ContactRolesInputComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() contact?: IContactContext;
	// @Output() readonly rolesChange = new EventEmitter<ContactRole[]>();

	protected roles?: IContactRole[];
	protected processingRoleIDs: ContactRole[] = [];

	protected readonly id = (_: number, role: IContactRole) => role.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		@Inject(CONTACT_ROLES_BY_TYPE) private readonly contactRolesByType: Record<ContactType, IContactRole[]>,
		private readonly contactService: ContactService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['contact']) {
			this.setRoles();
		}
	}

	private setRoles(): void {
		this.roles = this.contact?.brief?.type && this.contactRolesByType ? this.contactRolesByType[this.contact.brief.type] : undefined;
	}

	onRoleChanged(event: Event, role: IContactRole): void {
		console.log('onRoleChanged', role, event);
		if (!this.team || !this.contact) {
			alert('team or contact is not set');
			return;
		}
		const request: ISetContactRoleRequest = {
			contactID: this.contact.id,
			teamID: this.team?.id,
			role: role.id,
			value: (event.target as HTMLInputElement).checked,
		}
		this.processingRoleIDs.push(role.id);
		const complete = () => this.processingRoleIDs = this.processingRoleIDs.filter(id => id !== role.id);
		this.contactService.setContactRole(request).subscribe({
			error: (err: unknown) => {
				console.log('setContactRole error', err);
				this.errorLogger.logError(err, 'failed to set contact role');
				complete();
				this.setRoles();
				event.preventDefault();
			},
			complete,
		})
	}
}
