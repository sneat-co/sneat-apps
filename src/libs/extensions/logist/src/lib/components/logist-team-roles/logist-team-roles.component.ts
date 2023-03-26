import { Component } from '@angular/core';
import { LogistTeamRole, LogistTeamRoles } from '../../dto';

@Component({
	selector: 'sneat-logist-team-roles',
	templateUrl: 'logist-team-roles.component.html',
})
export class LogistTeamRolesComponent {
	protected readonly roles: {
		readonly id: LogistTeamRole,
		readonly title: string;
	}[] = Object.entries(LogistTeamRoles)
		.sort((a, b) => a[1] > b[1] ? 1 : -1)
		.map(role => ({id: role[0] as LogistTeamRole, title: role[1]}));
}
