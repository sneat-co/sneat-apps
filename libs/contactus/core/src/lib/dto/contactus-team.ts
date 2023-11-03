import { IContactBrief } from '.';
import { IIdAndDto } from '@sneat/core';

export interface IContactusTeamDto {
	contacts: Readonly<{ [id: string]: IContactBrief }>;
}

export type IContactusTeamDtoAndID = IIdAndDto<IContactusTeamDto>;
