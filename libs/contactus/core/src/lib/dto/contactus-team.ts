import { IContactBrief } from '.';
import { IIdAndDto } from '@sneat/core';

export interface IContactusTeamDto {
	contacts: Readonly<Record<string, IContactBrief>>;
}

export type IContactusTeamDtoAndID = IIdAndDto<IContactusTeamDto>;
