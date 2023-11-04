export const AssetPossessionUndisclosed = 'undisclosed',
	AssetPossessionOwning = 'owning',
	AssetPossessionRenting = 'renting',
	AssetPossessionLeasing = 'leasing';

export type AssetStatus = 'active' | 'archived' | 'draft';
export type AssetCategory =
	| 'undefined'
	| 'dwelling'
	| 'vehicle'
	| 'document'
	| 'debt'
	| 'misc';
export type AssetVehicleType =
	| 'aircraft'
	| 'bicycle'
	| 'boat'
	| 'bus'
	| 'car'
	| 'helicopter'
	| 'motorcycle'
	| 'truck'
	| 'van';
export type AssetRealEstateType = 'house' | 'apartment' | 'land';
export type AssetType = AssetVehicleType | AssetRealEstateType | string;
export const EngineTypeUnknown = '';
export const EngineTypeOther = 'other';
export const EngineTypePHEV = 'phev';
export const EngineTypeCombustion = 'combustion';
export const EngineTypeElectric = 'electric';
export const EngineTypeHybrid = 'hybrid';
export const EngineTypeSteam = 'steam';
export type EngineType =
	| typeof EngineTypeUnknown
	| typeof EngineTypeOther
	| typeof EngineTypePHEV
	| typeof EngineTypeCombustion
	| typeof EngineTypeElectric
	| typeof EngineTypePHEV
	| typeof EngineTypeHybrid
	| typeof EngineTypeSteam;

export enum EngineTypes {
	unknown = '',
	other = 'other',
	phev = 'phev',
	combustion = 'combustion',
	electric = 'electric',
	hybrid = 'hybrid',
	steam = 'steam',
}

export const FuelTypeUnknown = '';
export const FuelTypeOther = 'other';
export const FuelTypePetrol = 'petrol';
export const FuelTypeDiesel = 'diesel';
export const FuelTypeHydrogen = 'hydrogen';
export const FuelTypeElectricity = 'electricity';
export type FuelType =
	| typeof FuelTypeUnknown
	| typeof FuelTypeOther
	| typeof FuelTypePetrol
	| typeof FuelTypeDiesel
	| typeof FuelTypeHydrogen
	| typeof FuelTypeElectricity;

export enum FuelTypes {
	unknown = '', // unknown
	other = 'other',
	petrol = 'petrol',
	diesel = 'diesel',
	hydrogen = 'hydrogen',
	electricity = 'electricity',
}

export type AssetPossession =
	| typeof AssetPossessionUndisclosed
	| typeof AssetPossessionOwning
	| typeof AssetPossessionRenting
	| typeof AssetPossessionLeasing;
export const AssetPossessions: AssetPossession[] = [
	AssetPossessionOwning,
	AssetPossessionRenting,
	AssetPossessionLeasing,
	AssetPossessionUndisclosed,
];
