import {
	AssetExtraType,
	IAssetDboBase,
	IAssetExtra,
} from '@sneat/mod-assetus-core';
import { CurrencyCode } from '@sneat/mod-schedulus-core';
import { SpaceRequest } from '@sneat/team-models';

export interface ICreateAssetRequest<
	ExtraType extends AssetExtraType,
	Extra extends IAssetExtra,
> extends SpaceRequest {
	readonly asset: IAssetDboBase<ExtraType, Extra>;
	readonly memberID?: string;
}

export interface IAssetRequest extends SpaceRequest {
	assetID: string;
	assetCategory: string;
}

export interface IUpdateAssetRequest extends IAssetRequest {
	regNumber?: string;
}

export interface IAddVehicleRecordRequest extends SpaceRequest {
	readonly assetID: string;
	readonly fuelVolume?: number;
	readonly fuelVolumeUnit?: 'l' | 'g';
	readonly fuelCost?: number;
	readonly currency?: CurrencyCode;
	readonly mileage?: number;
	readonly mileageUnit?: 'km' | 'mile';
}
