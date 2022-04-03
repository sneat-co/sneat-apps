import { INavContext } from '@sneat/core';
import { IContact2Asset } from './dto-contact2';
import { IDemoRecord, ITeamRecord, ITitled, ITitledRecord, ITotalsHolder } from './dto-models';
import { AssetType, CountryId, FuelType, LiabilityServiceType, VehicleType } from './types';

export interface AssetLiabilityInfo {
	id: string;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: {
		id: string;
		title: string;
	};
}

export interface ISubAssetInfo extends ITitledRecord {
	type: AssetType;
	countryId?: CountryId;
	subType: string;
	expires?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetBase extends ITitled {
	type: AssetType;
	subType?: string; // E.g. subcategory - for example for documents could be: passport, visa, etc.
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
	parentCategoryID?: AssetType;
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

export interface IVehicle {
	make: string;
	model: string;
	engine?: string;
	engineCC?: number;
	fuelType?: FuelType;
	vin?: string;
	vehicleType?: VehicleType;
	number?: string;
	nctExpires?: string;     // ISO date string 'YYYY-MM-DD'
	nctExpiresTaskId?: string;
	taxExpires?: string;     // ISO date string 'YYYY-MM-DD'
	taxExpiresTaskId?: string;
	nextServiceDue?: string; // ISO date string 'YYYY-MM-DD'
	nextServiceDueTaskId?: string;
}

export interface IDocument extends IAssetDto {
	issuedOn?: string; // ISO date string 'YYYY-MM-DD'
	issuedBy?: string;
	expiresOn?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetType extends ITitledRecord {
	id: AssetType;
	iconName?: string;
	order?: number;
	desc?: string;
	canHaveIncome?: boolean;
	canHaveExpense?: boolean;
}

export interface IAssetDtoGroupCounts {
	assets?: number;
}

export interface IAssetDtoGroup extends ITeamRecord, ITitledRecord, ITotalsHolder {
	order: number;
	desc?: string;
	categoryId?: AssetType;
	numberOf?: IAssetDtoGroupCounts;
}
