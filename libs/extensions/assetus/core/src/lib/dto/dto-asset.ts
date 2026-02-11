import { IAddress } from '@sneat/contactus-core';
import { INavContext } from '@sneat/core';
import {
  AssetCategory,
  AssetPossession,
  AssetStatus,
  AssetType,
  EngineType,
  FuelType,
} from './assetus-types';
import {
  IDemoRecord,
  ITitled,
  ITitledRecord,
  ITotalsHolder,
  IWithSpaceIDs,
  IWithModified,
  CountryId,
} from '@sneat/dto';
import { LiabilityServiceType } from './dto-liability';

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

export interface IAssetBrief<
  ExtraType extends AssetExtraType = string,
  Extra extends IAssetExtra = IAssetExtra,
> extends IWithAssetExtra<ExtraType, Extra> {
  title?: string;
  isRequest?: boolean;
  status: AssetStatus;
  category: AssetCategory;
  countryID?: CountryId;
  type?: AssetType; // E.g. subcategory - for example for documents could be: passport, visa, etc.
  yearOfBuild?: number; // TODO: consider using only `dateOfBuild`
  dateOfBuild?: string; // ISO date string 'YYYY-MM-DD'
  possession: AssetPossession;
}

export interface IAssetusSpaceDbo extends ITitled {
  assets?: Record<string, IAssetBrief>;
}

export type AssetExtraType =
  | 'unknown'
  | 'empty'
  | 'vehicle'
  | 'dwelling'
  | 'document'
  | string;

export interface IAssetExtra {
  [key: string]: unknown;
}

export type IAssetusSpaceContext = INavContext<
  IAssetusSpaceDbo,
  IAssetusSpaceDbo
>;

export interface IAssetDboBase<
  ExtraType extends AssetExtraType = string,
  Extra extends IAssetExtra = IAssetExtra,
>
  extends
    IAssetBrief<ExtraType, Extra>,
    IDemoRecord,
    ITotalsHolder,
    IWithModified {
  spaceID?: string;
  parentAssetID?: string;
  desc?: string;
  memberIDs?: string[];
  parentCategoryID?: AssetCategory;
  sameAssetID?: string; // A link to realtor's or tenant's asset ID
  groupId?: string; // TODO: document what it is
  subAssets?: ISubAssetInfo[];
  // contacts?: IContact2Asset[];
  membersInfo?: ITitledRecord[];
  liabilities?: AssetLiabilityInfo[];
  notUsedServiceTypes?: LiabilityServiceType[];
}

export interface IWithAssetExtra<
  ExtraType extends AssetExtraType,
  Extra extends IAssetExtra,
> {
  extraType: ExtraType;
  extra?: Extra;
}

export interface IAssetDbo<
  ExtraType extends AssetExtraType,
  Extra extends IAssetExtra,
> extends IAssetDboBase<ExtraType, Extra> {
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

export interface IWithMakeAndModel {
  make: string;
  model: string;
}

export interface IAssetVehicleExtra
  extends IAssetExtra, IWithMakeAndModel, IEngine {
  vin?: string;
  regNumber?: string;
  nctExpires?: string; // ISO date string 'YYYY-MM-DD'
  nctExpiresTaskId?: string;
  taxExpires?: string; // ISO date string 'YYYY-MM-DD'
  taxExpiresTaskId?: string;
  nextServiceDue?: string; // ISO date string 'YYYY-MM-DD'
  nextServiceDueTaskId?: string;
}

export interface IAssetDwellingExtra extends IAssetExtra {
  address?: IAddress;
  rent_price?: {
    value?: number;
    currency?: string;
  };
  numberOfBedrooms?: number;
  areaSqM?: number;
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
  extends IWithSpaceIDs, ITitledRecord, ITotalsHolder {
  id: string;
  order: number;
  desc?: string;
  categoryId?: AssetCategory;
  numberOf?: IAssetDtoGroupCounts;
}
