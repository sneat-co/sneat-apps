import { IIdAndDboWithSpaceRef, ISpaceRef } from '@sneat/core';
import { IContactBase, IContactBrief, IContactDbo } from '../dto';
import { ISpaceItemNavContext } from '@sneat/space-models';

export interface IContactContext
	extends ISpaceItemNavContext<IContactBrief, IContactDbo> {
	parentContact?: IContactContext;
}

export type ContactDboWithSpaceRef = {
	readonly dbo: IContactDbo;
	readonly space: ISpaceRef;
};

export type ContactIdAndDboWithSpaceRef = IIdAndDboWithSpaceRef<IContactDbo>;

export type NewContactBaseDboAndSpaceRef = {
	readonly dbo: IContactBase;
	readonly space: ISpaceRef;
};
