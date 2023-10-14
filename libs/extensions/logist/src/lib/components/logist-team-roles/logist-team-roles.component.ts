import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LogistTeamRole, LogistTeamRoles } from '../../dto';

@Component({
	selector: 'sneat-logist-team-roles',
	templateUrl: 'logist-team-roles.component.html',
})
export class LogistTeamRolesComponent {
	protected readonly roles: {
		readonly id: LogistTeamRole;
		readonly title: string;
	}[] = Object.entries(LogistTeamRoles)
		.sort((a, b) => (a[1] > b[1] ? 1 : -1))
		.map((role) => ({ id: role[0] as LogistTeamRole, title: role[1] }));

	@Input() selectedRoles: string[] = [];
	@Output() selectedRolesChange = new EventEmitter<string[]>();

	protected onRoleChanged(event: Event): void {
		console.log('onRoleChanged', event);
		const ce: CustomEvent = event as CustomEvent;
		const role = ce.detail.value as LogistTeamRole;
		if (ce.detail.checked) {
			this.selectedRoles = [...this.selectedRoles, role];
		} else {
			this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
		}
		this.selectedRolesChange.emit(this.selectedRoles);
	}
}
