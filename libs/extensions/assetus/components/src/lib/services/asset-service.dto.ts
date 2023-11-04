import { IAssetMainData } from '@sneat/mod-assetus-core';
import { ITeamRequest } from '@sneat/team-models';

export interface ICreateAssetRequest<A extends IAssetMainData>
	extends ITeamRequest {
	readonly asset: A;
}

export interface IAssetRequest extends ITeamRequest {
	assetID: string;
	assetCategory: string;
}

export interface IUpdateAssetRequest extends IAssetRequest {
	regNumber?: string;
}
