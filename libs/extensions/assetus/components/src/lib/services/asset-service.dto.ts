import {
	AssetExtraType,
	IAssetDboBase,
	IAssetExtra,
	IAssetMainData,
} from '@sneat/mod-assetus-core';
import { ITeamRequest } from '@sneat/team-models';

export interface ICreateAssetRequest<
	ExtraType extends AssetExtraType,
	Extra extends IAssetExtra<ExtraType>,
> extends ITeamRequest {
	readonly asset: IAssetDboBase<ExtraType, Extra>;
	readonly memberID?: string;
}

export interface IAssetRequest extends ITeamRequest {
	assetID: string;
	assetCategory: string;
}

export interface IUpdateAssetRequest extends IAssetRequest {
	regNumber?: string;
}
