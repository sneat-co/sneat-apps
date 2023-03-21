export interface IAddress {
	countryID: string;
	zipCode?: string;
	lines?: string;
}

export function validateAddress(address?: IAddress): IAddress {
	if (!address) {
		throw new Error('Address is required');
	}
	if (address.countryID === '') {
		throw new Error('Country is required');
	}
	if (!address?.lines?.trim()) {
		throw new Error('Address is required');
	}
	return address;
}
