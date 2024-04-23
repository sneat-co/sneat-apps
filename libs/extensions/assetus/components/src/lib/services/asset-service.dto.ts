import {
	IAssetDboBase,
	IAssetExtra,
	IAssetMainData,
} from '@sneat/mod-assetus-core';
import { ITeamRequest } from '@sneat/team-models';

export interface ICreateAssetRequest<Extra extends IAssetExtra>
	extends ITeamRequest {
	readonly asset: IAssetDboBase<Extra>;
	readonly memberID?: string;
}

export interface IAssetRequest extends ITeamRequest {
	assetID: string;
	assetCategory: string;
}

export interface IUpdateAssetRequest extends IAssetRequest {
	regNumber?: string;
}
