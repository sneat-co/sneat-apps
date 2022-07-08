import { INavContext } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface IExpressTeamDto {
	readonly contactID: string;
}

export interface IExpressTeamBrief extends IExpressTeamDto {
	readonly id: string;
}

export type IExpressTeamContext = INavContext<IExpressTeamBrief, IExpressTeamDto>;


export interface ISetExpressTeamSettingsRequest extends ITeamRequest {
	address: IAddress;
	vatNumber?: string;
	orderNumberPrefix?: string;
}
