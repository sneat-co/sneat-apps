import { INavContext } from '@sneat/core';
import { ITeamItemContext } from '@sneat/team/models';
import { IContact2Asset } from './dto-contact2';
import { IDemoRecord, ITitled, ITitledRecord, ITotalsHolder, IWithTeamIDs } from './dto-models';
import {
	AssetCategory,
	AssetType,
	AssetVehicleType,
	CountryId, EngineType,
	FuelType,
	LiabilityServiceType,
} from './types';

export interface AssetLiabilityInfo {
	id: string;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: {
		id: string;
		title: string;
	};
}

export interface ISubAssetInfo extends ITitledRecord {
	type: AssetCategory;
	countryId?: CountryId;
	subType: string;
	expires?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetBase extends ITitled {
	category: AssetCategory;
	type?: AssetType; // E.g. subcategory - for example for documents could be: passport, visa, etc.
	make?: string;
	model?: string;
	regNumber?: string;
}

export interface IAssetBrief extends IAssetBase {
	id: string;
}

export interface IAssetMain extends IAssetBase {
	parentAssetID?: string;
	desc?: string;
	countryID?: CountryId;
	yearOfBuild?: number; // TODO: consider using only `dateOfBuild`
	dateOfBuild?: string; // ISO date string 'YYYY-MM-DD'
	memberIDs?: string[];
	regNumber?: string;
}

export interface IAssetDto extends IAssetMain, IDemoRecord, ITotalsHolder {
	teamID?: string;
	parentCategoryID?: AssetCategory;
	sameAssetID?: string; // A link to realtor's or tenant's asset ID
	groupId?: string; // TODO: document what it is
	subAssets?: ISubAssetInfo[];
	contacts?: IContact2Asset[];
	membersInfo?: ITitledRecord[];
	liabilities?: AssetLiabilityInfo[];
	notUsedServiceTypes?: LiabilityServiceType[];
}

export interface IDwelling {
	address?: string;
	rent?: 'landlord' | 'tenant';
}


export interface IEngine {
	engineType?: EngineType;
	engineFuel?: FuelType;
	engineCC?: number;
	engineKW?: number;
	engineNM?: number;
	engineSerialNumber?: string;
}

export interface IVehicleData extends IEngine {
	vin?: string;
	number?: string;
	nctExpires?: string;     // ISO date string 'YYYY-MM-DD'
	nctExpiresTaskId?: string;
	taxExpires?: string;     // ISO date string 'YYYY-MM-DD'
	taxExpiresTaskId?: string;
	nextServiceDue?: string; // ISO date string 'YYYY-MM-DD'
	nextServiceDueTaskId?: string;
}

export interface IVehicleAssetDto extends IAssetDto, IVehicleData {
	//
}

export type IVehicleAssetContext<Dto extends IVehicleAssetDto = IVehicleAssetDto> = ITeamItemContext<IAssetBrief, Dto>;

export interface IAssetType extends ITitledRecord {
	id: AssetCategory;
	iconName?: string;
	order?: number;
	desc?: string;
	canHaveIncome?: boolean;
	canHaveExpense?: boolean;
}

export interface IAssetDtoGroupCounts {
	assets?: number;
}

export interface IAssetDtoGroup extends IWithTeamIDs, ITitledRecord, ITotalsHolder {
	id: string;
	order: number;
	desc?: string;
	categoryId?: AssetCategory;
	numberOf?: IAssetDtoGroupCounts;
}

export type IAssetGroupContext = INavContext<IAssetDtoGroup, IAssetDtoGroup>;
