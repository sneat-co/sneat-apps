export type GeoRegion =
	| 'Europe'
	| 'Asia'
	| 'South America'
	| 'North America'
	| 'Pacific Ocean'
	| 'Africa';

export interface ICountry {
	id: string;
	geoRegions: GeoRegion[];
	title: string;
	emoji: string;
}

export const countriesByID: Record<string, ICountry> = {
	AF: { id: 'AF', geoRegions: ['Asia'], title: 'Afghanistan', emoji: '🇦🇫' },
	AU: {
		id: 'AU',
		geoRegions: ['Pacific Ocean'],
		title: 'Australia',
		emoji: '🇦🇺',
	},
	CA: {
		id: 'CA',
		geoRegions: ['North America'],
		title: 'Canada',
		emoji: '🇨🇦',
	},
	EE: { id: 'EE', geoRegions: ['Europe'], title: 'Estonia', emoji: '🇪🇪' },
	LV: { id: 'LV', geoRegions: ['Europe'], title: 'Latvia', emoji: '🇱🇻' },
	LT: { id: 'LT', geoRegions: ['Europe'], title: 'Lithuania', emoji: '🇱🇹' },
	IE: { id: 'IE', geoRegions: ['Europe'], title: 'Ireland', emoji: '🇮🇪' },
	NZ: {
		id: 'NZ',
		geoRegions: ['Pacific Ocean'],
		title: 'New Zealand',
		emoji: '🇳🇿',
	},
	RU: {
		id: 'RU',
		geoRegions: ['Europe', 'Asia'],
		title: 'Russia',
		emoji: '🇷🇺',
	},
	ES: { id: 'ES', geoRegions: ['Europe'], title: 'Spain', emoji: '🇪🇸' },
	UK: {
		id: 'UK',
		geoRegions: ['Europe'],
		title: 'United Kingdom',
		emoji: '🇬🇧',
	},
	UA: { id: 'UA', geoRegions: ['Europe'], title: 'Ukraine', emoji: '🇺🇦' },
	US: {
		id: 'US',
		geoRegions: ['North America'],
		title: 'United States Of America',
		emoji: '🇺🇸',
	},
};

export const unknownCountry: ICountry = {
	id: '--',
	title: 'Unknown',
	geoRegions: [],
	emoji: '🏳️',
};

export const countries: ICountry[] = Object.values(countriesByID);
