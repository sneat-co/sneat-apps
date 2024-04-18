import { IContactusTeamDto } from '@sneat/contactus-core';
import { TeamModuleBaseComponent } from '@sneat/team-components';

export abstract class ContactusModuleBaseComponent extends TeamModuleBaseComponent<
	IContactusTeamDto,
	IContactusTeamDto
> {}
