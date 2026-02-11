import { IIdAndOptionalDbo } from '@sneat/core';
import { IContactBrief } from './contact';

export interface IContactusSpaceDbo {
  contacts: Readonly<Record<string, IContactBrief>>;
}

export type IContactusSpaceDboAndID = IIdAndOptionalDbo<IContactusSpaceDbo>;
