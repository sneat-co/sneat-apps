import { INavContext } from '@sneat/core';
// import { IContact2Asset } from './dto-contact2item';
import { IDocData, IDocumentBrief } from './dto-document';
import {
	IDemoRecord,
	ITitled,
	ITitledRecord,
	ITotalsHolder,
	IWithTeamIDs,
} from './dto-models';
import { IWithModified } from './dto-with-modified';
import {
	AssetCategory,
	AssetPossession,
	AssetStatus,
	AssetType,
	// AssetType,
	CountryId,
	EngineType,
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

export interface IAssetBrief extends ITitled {
	isRequest?: boolean;
	status: AssetStatus;
	category: AssetCategory;
	countryID?: CountryId;
	type?: AssetType; // E.g. subcategory - for example for documents could be: passport, visa, etc.
	make?: string;
	model?: string;
	regNumber?: string;
	yearOfBuild?: number; // TODO: consider using only `dateOfBuild`
	dateOfBuild?: string; // ISO date string 'YYYY-MM-DD'
	possession: AssetPossession;
}

export interface IAssetusTeamDto extends ITitled {
	assets?: { [id: string]: IAssetBrief };
}

export interface IAssetusTeamContext
	extends INavContext<IAssetusTeamDto, IAssetusTeamDto> {}

export interface IAssetMainData extends IAssetBrief {
	parentAssetID?: string;
	desc?: string;
	memberIDs?: string[];
	regNumber?: string;
}

export interface IAssetDtoBase
	extends IAssetMainData,
		IDemoRecord,
		ITotalsHolder,
		IWithModified {
	teamID?: string;
	parentCategoryID?: AssetCategory;
	sameAssetID?: string; // A link to realtor's or tenant's asset ID
	groupId?: string; // TODO: document what it is
	subAssets?: ISubAssetInfo[];
	// contacts?: IContact2Asset[];
	membersInfo?: ITitledRecord[];
	liabilities?: AssetLiabilityInfo[];
	notUsedServiceTypes?: LiabilityServiceType[];
}

export interface IDwelling {
	address?: string;
	rent?: 'landlord' | 'tenant';
}

export interface IEngine {
	engineType: EngineType;
	engineFuel: FuelType;
	engineCC?: number;
	engineKW?: number;
	engineNM?: number;
	engineSerialNumber?: string;
}

export interface IVehicleData extends IEngine {
	vin?: string;
	number?: string;
	nctExpires?: string; // ISO date string 'YYYY-MM-DD'
	nctExpiresTaskId?: string;
	taxExpires?: string; // ISO date string 'YYYY-MM-DD'
	taxExpiresTaskId?: string;
	nextServiceDue?: string; // ISO date string 'YYYY-MM-DD'
	nextServiceDueTaskId?: string;
}

export interface IVehicleAssetDto extends IAssetDtoBase, IVehicleData {}

export interface IVehicleMainData extends IAssetMainData, IVehicleData {}

export interface IDocumentAssetDto
	extends IDocumentBrief,
		IDocData,
		IAssetDtoBase {}

export interface IDocumentMainData extends IAssetMainData, IDocData {}

export interface IAssetCategory extends ITitledRecord {
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

export interface IAssetDtoGroup
	extends IWithTeamIDs,
		ITitledRecord,
		ITotalsHolder {
	id: string;
	order: number;
	desc?: string;
	categoryId?: AssetCategory;
	numberOf?: IAssetDtoGroupCounts;
}

export type IAssetGroupContext = INavContext<IAssetDtoGroup, IAssetDtoGroup>;
