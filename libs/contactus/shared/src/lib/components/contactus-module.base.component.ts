import { IContactusSpaceDbo } from '@sneat/contactus-core';
import { TeamModuleBaseComponent } from '@sneat/team-components';

export abstract class ContactusModuleBaseComponent extends TeamModuleBaseComponent<
	IContactusSpaceDbo,
	IContactusSpaceDbo
> {}
