import { IContactBrief } from '.';
import { IIdAndOptionalDbo } from '@sneat/core';

export interface IContactusTeamDto {
	contacts: Readonly<Record<string, IContactBrief>>;
}

export type IContactusTeamDtoAndID = IIdAndOptionalDbo<IContactusTeamDto>;
