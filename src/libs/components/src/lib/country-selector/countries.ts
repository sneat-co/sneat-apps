export interface ICountry {
	id: string;
	title: string;
	emoji: string;
};

export const countries: ICountry[] = [
	{ id: 'au', title: 'Australia', emoji: '🇦🇺' },
	{ id: 'ee', title: 'Estonia', emoji: '🇪🇪' },
	{ id: 'lv', title: 'Latvia', emoji: '🇱🇻' },
	{ id: 'ie', title: 'Ireland', emoji: '🇮🇪' },
	{ id: 'nz', title: 'New Zealand', emoji: '🇳🇿' },
	{ id: 'ru', title: 'Russia', emoji: '🇷🇺' },
	{ id: 'es', title: 'Spain', emoji: '🇪🇸' },
	{ id: 'uk', title: 'United Kingdom', emoji: '🇬🇧' },
	{ id: 'ua', title: 'Ukraine', emoji: '🇺🇦' },
	{ id: 'us', title: 'United States Of America', emoji: '🇺🇸' },
];
