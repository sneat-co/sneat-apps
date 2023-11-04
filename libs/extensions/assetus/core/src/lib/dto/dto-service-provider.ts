import { AssetCategory } from './assetus-types';
import { LiabilityServiceType, ServiceCategory, SettlementType } from '.';
import { ITitledRecord } from '@sneat/dto';

export interface ServiceProviderContact {
	type: 'phone' | 'twitter' | 'fbm' | 'post' | 'chat';
	address: string;
	title?: string;
	worksHours?: string;
	note?: string;
}

export interface ServiceProviderContactsGroup {
	type: 'sales' | 'customer_support' | 'emergencies' | 'moving_house';
	title: string;
	note?: string;
	contacts: ServiceProviderContact[];
}

export interface ServiceProviderContacts {
	usUrl: string;
	groups: ServiceProviderContactsGroup[];
}

export type ServiceProviderStatus =
	| 'active'
	| 'rejected'
	| 'suggested'
	| 'archived';

export interface DtoServiceProvider extends ITitledRecord {
	countryId: string;
	status: ServiceProviderStatus;
	assetCategoryId?: AssetCategory;
	serviceTypes: LiabilityServiceType[];
	contact?: ServiceProviderContacts;
}

interface ServicePlanOffer {
	title: string;
	description: string;
}

export interface DtoServicePlan extends ITitledRecord {
	settlementType?: SettlementType;
	providerId: string;
	eab: number; //  Estimated Annual Bill
	eabWithOffers?: number;
	pricePerUnit: number;
	discountPercentRange?: {
		from: number;
		to: number;
	};
	offers?: ServicePlanOffer[];
	unit: 'kWh';
}

export interface LinkedToAssetCategories {
	assetCategoryIds: AssetCategory[];
}

export interface DtoServiceType extends ITitledRecord, LinkedToAssetCategories {
	serviceCategoryId: ServiceCategory;
}
