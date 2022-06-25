import { OrderDirection } from '../index';

export interface IOrdersFilter {
	status?: string;
	direction?: OrderDirection;
	refNumber?: string;
	countryID?: string;
	contactID?: string;
}
