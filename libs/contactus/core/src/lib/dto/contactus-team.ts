import { IContactBrief } from '.';
import { IIdAndDto, IIdAndOptionalDto } from '@sneat/core';

export interface IContactusTeamDto {
	contacts: Readonly<Record<string, IContactBrief>>;
}

export type IContactusTeamDtoAndID = IIdAndOptionalDto<IContactusTeamDto>;
