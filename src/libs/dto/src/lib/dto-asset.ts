import { AssetCategoryId, CountryId, FuelType, LiabilityServiceType, VehicleType } from './types';
import { ICommuneRecord, IDemoRecord, ITitledRecord, ITotalsHolder } from './dto-models';
import { IContact2Asset } from './dto-contact';

export interface AssetLiabilityInfo {
	id: string;
	serviceTypes?: LiabilityServiceType[];
	serviceProvider?: {
		id: string;
		title: string;
	};
}

export interface ISubAssetInfo extends ITitledRecord {
	categoryId: AssetCategoryId;
	countryId?: CountryId;
	type: string;
	expires?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetDto extends ITitledRecord, IDemoRecord, ITotalsHolder {
	id?: string;
	parentAssetId?: string;
	parentCategoryId?: AssetCategoryId;
	sameAssetId?: string; // A link to realtor's or tenant's asset ID
	desc?: string;
	categoryId?: AssetCategoryId;
	countryId?: CountryId;
	teamId?: string;
	groupId?: string;
	subAssets?: ISubAssetInfo[];
	contacts?: IContact2Asset[];
	memberIds?: string[];
	membersInfo?: ITitledRecord[];
	type?: string; // E.g. subcategory - for example for documents could be: passport, visa, etc.
	number?: string;
	liabilities?: AssetLiabilityInfo[];
	notUsedServiceTypes?: LiabilityServiceType[];
}

export interface IDwelling extends IAssetDto {
	address?: string;
	rent?: 'landlord' | 'tenant';
}

export interface IVehicle extends IAssetDto {
	make?: string;
	model?: string;
	engine?: string;
	engineCC?: number;
	fuelType?: FuelType;
	vin?: string;
	yearBuild?: number;
	dateBuild?: string; // ISO date string 'YYYY-MM-DD'
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
	issued?: string; // ISO date string 'YYYY-MM-DD'
	issuedBy?: string;
	expires?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IAssetDtoCategory extends ITitledRecord {
	id: AssetCategoryId;
	order: number;
	desc?: string;
	canHaveIncome: boolean;
	canHaveExpense: boolean;
}

export interface IAssetDtoGroupCounts {
	assets?: number;
}

export interface IAssetDtoGroup extends ICommuneRecord, ITitledRecord, ITotalsHolder {
	order: number;
	desc?: string;
	categoryId?: AssetCategoryId;
	numberOf?: IAssetDtoGroupCounts;
}
