export interface ICountry {
	id: string;
	title: string;
	emoji: string;
}

export const countriesByID: { [id: string]: ICountry } = {
	'AU': { id: 'AU', title: 'Australia', emoji: '🇦🇺' },
	'EE': { id: 'EE', title: 'Estonia', emoji: '🇪🇪' },
	'LV': { id: 'LV', title: 'Latvia', emoji: '🇱🇻' },
	'LT': { id: 'LT', title: 'Lithuania', emoji: '🇱🇹' },
	'IE': { id: 'IE', title: 'Ireland', emoji: '🇮🇪' },
	'NZ': { id: 'NZ', title: 'New Zealand', emoji: '🇳🇿' },
	'RU': { id: 'RI', title: 'Russia', emoji: '🇷🇺' },
	'ES': { id: 'ES', title: 'Spain', emoji: '🇪🇸' },
	'UK': { id: 'UK', title: 'United Kingdom', emoji: '🇬🇧' },
	'UA': { id: 'UA', title: 'Ukraine', emoji: '🇺🇦' },
	'US': { id: 'US', title: 'United States Of America', emoji: '🇺🇸' },
};

export const countries: ICountry[] = Object.values(countriesByID);
