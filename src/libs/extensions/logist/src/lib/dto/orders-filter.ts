export type OrderDirection = 'import' | 'export' | 'internal';

export interface IOrdersFilter {
	status?: string;
	direction?: OrderDirection;
	refNumber?: string;
	countryID?: string;
	contactID?: string;
}
