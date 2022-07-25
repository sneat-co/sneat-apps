export interface ICountry {
	id: string;
	title: string;
	emoji: string;
};

export const countriesByID: {[id: string]: ICountry} = {
	'au': { id: 'au', title: 'Australia', emoji: '🇦🇺' },
	'ee': { id: 'ee', title: 'Estonia', emoji: '🇪🇪' },
	'lv': { id: 'lv', title: 'Latvia', emoji: '🇱🇻' },
	'lt': { id: 'lt', title: 'Lithuania', emoji: '🇱🇹' },
	'ie': { id: 'ie', title: 'Ireland', emoji: '🇮🇪' },
	'nz': { id: 'nz', title: 'New Zealand', emoji: '🇳🇿' },
	'ru': { id: 'ru', title: 'Russia', emoji: '🇷🇺' },
	'es': { id: 'es', title: 'Spain', emoji: '🇪🇸' },
	'uk': { id: 'uk', title: 'United Kingdom', emoji: '🇬🇧' },
	'ua': { id: 'ua', title: 'Ukraine', emoji: '🇺🇦' },
	'us': { id: 'us', title: 'United States Of America', emoji: '🇺🇸' },
};

export const countries: ICountry[] = Object.values(countriesByID);
