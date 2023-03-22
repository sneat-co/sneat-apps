export interface IAddress {
	readonly countryID: string;
	readonly zipCode?: string;
	readonly state?: string;
	readonly city?: string;
	readonly lines?: string;
}

export function validateAddress(address?: IAddress): IAddress {
	if (!address) {
		throw new Error('Address is required');
	}
	if (address.countryID === '') {
		throw new Error('Country is required');
	}
	if (!address?.city?.trim()) {
		throw new Error('Address city is required');
	}
	if (!address?.lines?.trim()) {
		throw new Error('Address text is required');
	}
	return address;
}
