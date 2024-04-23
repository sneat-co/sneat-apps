import { INavContext } from '@sneat/core';
import {
	AssetCategory,
	AssetPossession,
	AssetStatus,
	AssetType,
	EngineType,
	FuelType,
} from './assetus-types';
// import { IContact2Asset } from './dto-contact2item';
import { IAssetDocumentExtra } from './dto-document';
import {
	IDemoRecord,
	ITitled,
	ITitledRecord,
	ITotalsHolder,
	IWithTeamIDs,
	IWithModified,
	CountryId,
} from '@sneat/dto';
import { LiabilityServiceType } from './';

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
	assets?: Record<string, IAssetBrief>;
}

export interface IAssetExtra {
	type: AssetType | 'empty';
}

export interface IAssetEmptyExtra extends IAssetExtra {
	type: 'empty';
}

export type IAssetusTeamContext = INavContext<IAssetusTeamDto, IAssetusTeamDto>;

export interface IAssetMainData extends IAssetBrief {
	parentAssetID?: string;
	desc?: string;
	memberIDs?: string[];
}

export interface IAssetDboBase<Extra extends IAssetExtra = IAssetExtra>
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
	extra?: Extra;
}

export interface IAssetDbo<Extra extends IAssetExtra>
	extends IAssetDboBase<Extra> {
	readonly userIDs?: string[]; // TODO - define actual fields
}

export interface IEngine {
	engineType: EngineType;
	engineFuel: FuelType;
	engineCC?: number;
	engineKW?: number;
	engineNM?: number;
	engineSerialNumber?: string;
}

export interface IAssetVehicleExtra extends IAssetExtra, IEngine {
	vin?: string;
	number?: string;
	nctExpires?: string; // ISO date string 'YYYY-MM-DD'
	nctExpiresTaskId?: string;
	taxExpires?: string; // ISO date string 'YYYY-MM-DD'
	taxExpiresTaskId?: string;
	nextServiceDue?: string; // ISO date string 'YYYY-MM-DD'
	nextServiceDueTaskId?: string;
}

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
