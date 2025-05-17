import {
	AssetExtraType,
	IAssetDboBase,
	IAssetExtra,
} from '@sneat/mod-assetus-core';
import { CurrencyCode } from '@sneat/mod-schedulus-core';
import { ISpaceRequest } from '@sneat/space-models';

export interface ICreateAssetRequest<
	ExtraType extends AssetExtraType,
	Extra extends IAssetExtra,
> extends ISpaceRequest {
	readonly asset: IAssetDboBase<ExtraType, Extra>;
	readonly memberID?: string;
}

export interface IAssetRequest extends ISpaceRequest {
	assetID: string;
	assetCategory: string;
}

export interface IUpdateAssetRequest extends IAssetRequest {
	regNumber?: string;
}

export interface IAddVehicleRecordRequest extends ISpaceRequest {
	readonly assetID: string;
	readonly fuelVolume?: number;
	readonly fuelVolumeUnit?: 'l' | 'g';
	readonly fuelCost?: number;
	readonly currency?: CurrencyCode;
	readonly mileage?: number;
	readonly mileageUnit?: 'km' | 'mile';
}
