import { IContactBrief } from '.';
import { IIdAndOptionalDbo } from '@sneat/core';

export interface IContactusSpaceDbo {
	contacts: Readonly<Record<string, IContactBrief>>;
}

export type IContactusSpaceDboAndID = IIdAndOptionalDbo<IContactusSpaceDbo>;
