export type GeoRegion =
	| 'Europe'
	| 'Asia'
	| 'South America'
	| 'North America'
	| 'Pacific Ocean'
	| 'Africa';

export interface ICountry {
	id: string;
	id3?: string;
	geoRegions: GeoRegion[];
	title: string;
	emoji: string;
}

export const countriesByID: Record<string, ICountry> = {
	AF: {
		id: 'AF',
		id3: 'AFG',
		geoRegions: ['Asia'],
		title: 'Afghanistan',
		emoji: '🇦🇫',
	},
	AL: {
		id: 'AL',
		id3: 'ALB',
		geoRegions: ['Europe'],
		title: 'Albania',
		emoji: '🇦🇱',
	},
	DZ: {
		id: 'DZ',
		id3: 'DZA',
		geoRegions: ['Africa'],
		title: 'Algeria',
		emoji: '🇩🇿',
	},
	AS: {
		id: 'AS',
		id3: 'ASM',
		geoRegions: ['Pacific Ocean'],
		title: 'American Samoa',
		emoji: '🇦🇸',
	},
	AD: {
		id: 'AD',
		id3: 'AND',
		geoRegions: ['Europe'],
		title: 'Andorra',
		emoji: '🇦🇩',
	},
	AO: {
		id: 'AO',
		id3: 'AGO',
		geoRegions: ['Africa'],
		title: 'Angola',
		emoji: '🇦🇴',
	},
	AI: {
		id: 'AI',
		id3: 'AIA',
		geoRegions: ['North America'],
		title: 'Anguilla',
		emoji: '🇦🇮',
	},
	AQ: {
		id: 'AQ',
		id3: 'ATA',
		geoRegions: ['Pacific Ocean'],
		title: 'Antarctica',
		emoji: '🇦🇶',
	},
	AG: {
		id: 'AG',
		id3: 'ATG',
		geoRegions: ['North America'],
		title: 'Antigua and Barbuda',
		emoji: '🇦🇬',
	},
	AR: {
		id: 'AR',
		id3: 'ARG',
		geoRegions: ['South America'],
		title: 'Argentina',
		emoji: '🇦🇷',
	},
	AM: {
		id: 'AM',
		id3: 'ARM',
		geoRegions: ['Asia'],
		title: 'Armenia',
		emoji: '🇦🇲',
	},
	AW: {
		id: 'AW',
		id3: 'ABW',
		geoRegions: ['North America'],
		title: 'Aruba',
		emoji: '🇦🇼',
	},
	AU: {
		id: 'AU',
		id3: 'AUS',
		geoRegions: ['Pacific Ocean'],
		title: 'Australia',
		emoji: '🇦🇺',
	},
	AZ: {
		id: 'AZ',
		id3: 'AZE',
		geoRegions: ['Asia'],
		title: 'Azerbaijan',
		emoji: '🇦🇿',
	},
	BS: {
		id: 'BS',
		id3: 'BHS',
		geoRegions: ['North America'],
		title: 'Bahamas',
		emoji: '🇧🇸',
	},
	BH: {
		id: 'BH',
		id3: 'BHR',
		geoRegions: ['Asia'],
		title: 'Bahrain',
		emoji: '🇧🇭',
	},
	BD: {
		id: 'BD',
		id3: 'BGD',
		geoRegions: ['Asia'],
		title: 'Bangladesh',
		emoji: '🇧🇩',
	},
	BB: {
		id: 'BB',
		id3: 'BRB',
		geoRegions: ['North America'],
		title: 'Barbados',
		emoji: '🇧🇧',
	},
	BY: {
		id: 'BY',
		id3: 'BLR',
		geoRegions: ['Europe'],
		title: 'Belarus',
		emoji: '🇧🇾',
	},
	BE: {
		id: 'BE',
		id3: 'BEL',
		geoRegions: ['Europe'],
		title: 'Belgium',
		emoji: '🇧🇪',
	},
	BZ: {
		id: 'BZ',
		id3: 'BLZ',
		geoRegions: ['North America'],
		title: 'Belize',
		emoji: '🇧🇿',
	},
	BJ: {
		id: 'BJ',
		id3: 'BEN',
		geoRegions: ['Africa'],
		title: 'Benin',
		emoji: '🇧🇯',
	},
	BM: {
		id: 'BM',
		id3: 'BMU',
		geoRegions: ['North America'],
		title: 'Bermuda',
		emoji: '🇧🇲',
	},
	BT: {
		id: 'BT',
		id3: 'BTN',
		geoRegions: ['Asia'],
		title: 'Bhutan',
		emoji: '🇧🇹',
	},
	BO: {
		id: 'BO',
		id3: 'BOL',
		geoRegions: ['South America'],
		title: 'Bolivia',
		emoji: '🇧🇴',
	},
	BQ: {
		id: 'BQ',
		id3: 'BES',
		geoRegions: ['North America'],
		title: 'Bonaire, Sint Eustatius and Saba',
		emoji: '🇧🇶',
	},
	BA: {
		id: 'BA',
		id3: 'BIH',
		geoRegions: ['Europe'],
		title: 'Bosnia and Herzegovina',
		emoji: '🇧🇦',
	},
	BW: {
		id: 'BW',
		id3: 'BWA',
		geoRegions: ['Africa'],
		title: 'Botswana',
		emoji: '🇧🇼',
	},
	BV: {
		id: 'BV',
		id3: 'BVT',
		geoRegions: ['South America', 'Africa'],
		title: 'Bouvet Island',
		emoji: '🇧🇻',
	},
	BR: {
		id: 'BR',
		id3: 'BRA',
		geoRegions: ['South America'],
		title: 'Brazil',
		emoji: '🇧🇷',
	},
	IO: {
		id: 'IO',
		id3: 'IOT',
		geoRegions: ['Asia'],
		title: 'British Indian Ocean Territory',
		emoji: '🇮🇴',
	},
	BN: {
		id: 'BN',
		id3: 'BRN',
		geoRegions: ['Asia'],
		title: 'Brunei Darussalam',
		emoji: '🇧🇳',
	},
	BG: {
		id: 'BG',
		id3: 'BGR',
		geoRegions: ['Europe'],
		title: 'Bulgaria',
		emoji: '🇧🇬',
	},
	BF: {
		id: 'BF',
		id3: 'BFA',
		geoRegions: ['Africa'],
		title: 'Burkina Faso',
		emoji: '🇧🇫',
	},
	BI: {
		id: 'BI',
		id3: 'BDI',
		geoRegions: ['Africa'],
		title: 'Burundi',
		emoji: '🇧🇮',
	},
	KH: {
		id: 'KH',
		id3: 'KHM',
		geoRegions: ['Asia'],
		title: 'Cambodia',
		emoji: '🇰🇭',
	},
	CM: {
		id: 'CM',
		id3: 'CMR',
		geoRegions: ['Africa'],
		title: 'Cameroon',
		emoji: '🇨🇲',
	},
	CA: {
		id: 'CA',
		id3: 'CAN',
		geoRegions: ['North America'],
		title: 'Canada',
		emoji: '🇨🇦',
	},
	CV: {
		id: 'CV',
		id3: 'CPV',
		geoRegions: ['Africa'],
		title: 'Cape Verde',
		emoji: '🇨🇻',
	},
	KY: {
		id: 'KY',
		id3: 'CYM',
		geoRegions: ['North America'],
		title: 'Cayman Islands',
		emoji: '🇰🇾',
	},
	CF: {
		id: 'CF',
		id3: 'CAF',
		geoRegions: ['Africa'],
		title: 'Central African Republic',
		emoji: '🇨🇫',
	},
	TD: {
		id: 'TD',
		id3: 'TCD',
		geoRegions: ['Africa'],
		title: 'Chad',
		emoji: '🇹🇩',
	},
	CL: {
		id: 'CL',
		id3: 'CHL',
		geoRegions: ['South America'],
		title: 'Chile',
		emoji: '🇨🇱',
	},
	CN: {
		id: 'CN',
		id3: 'CHN',
		geoRegions: ['Asia'],
		title: 'China',
		emoji: '🇨🇳',
	},
	CX: {
		id: 'CX',
		id3: 'CXR',
		geoRegions: ['Asia'],
		title: 'Christmas Island',
		emoji: '🇨🇽',
	},
	CC: {
		id: 'CC',
		id3: 'CCK',
		geoRegions: ['Asia'],
		title: 'Cocos (Keeling) Islands',
		emoji: '🇨🇨',
	},
	CO: {
		id: 'CO',
		id3: 'COL',
		geoRegions: ['South America'],
		title: 'Colombia',
		emoji: '🇨🇴',
	},
	KM: {
		id: 'KM',
		id3: 'COM',
		geoRegions: ['Africa'],
		title: 'Comoros',
		emoji: '🇰🇲',
	},
	CG: {
		id: 'CG',
		id3: 'COG',
		geoRegions: ['Africa'],
		title: 'Congo',
		emoji: '🇨🇬',
	},
	CD: {
		id: 'CD',
		id3: 'COD',
		geoRegions: ['Africa'],
		title: 'Congo (Democratic Republic of the)',
		emoji: '🇨🇩',
	},
	CK: {
		id: 'CK',
		id3: 'COK',
		geoRegions: ['Pacific Ocean'],
		title: 'Cook Islands',
		emoji: '🇨🇰',
	},
	CR: {
		id: 'CR',
		id3: 'CRI',
		geoRegions: ['North America'],
		title: 'Costa Rica',
		emoji: '🇨🇷',
	},
	HR: {
		id: 'HR',
		id3: 'HRV',
		geoRegions: ['Europe'],
		title: 'Croatia',
		emoji: '🇭🇷',
	},
	CU: {
		id: 'CU',
		id3: 'CUB',
		geoRegions: ['North America'],
		title: 'Cuba',
		emoji: '🇨🇺',
	},
	CW: {
		id: 'CW',
		id3: 'CUW',
		geoRegions: ['North America'],
		title: 'Curaçao',
		emoji: '🇨🇼',
	},
	CY: {
		id: 'CY',
		id3: 'CYP',
		geoRegions: ['Asia'],
		title: 'Cyprus',
		emoji: '🇨🇾',
	},
	CZ: {
		id: 'CZ',
		id3: 'CZE',
		geoRegions: ['Europe'],
		title: 'Czech Republic',
		emoji: '🇨🇿',
	},
	DK: {
		id: 'DK',
		id3: 'DNK',
		geoRegions: ['Europe'],
		title: 'Denmark',
		emoji: '🇩🇰',
	},
	DJ: {
		id: 'DJ',
		id3: 'DJI',
		geoRegions: ['Africa'],
		title: 'Djibouti',
		emoji: '🇩🇯',
	},
	DM: {
		id: 'DM',
		id3: 'DMA',
		geoRegions: ['North America'],
		title: 'Dominica',
		emoji: '🇩🇲',
	},
	DO: {
		id: 'DO',
		id3: 'DOM',
		geoRegions: ['North America'],
		title: 'Dominican Republic',
		emoji: '🇩🇴',
	},
	EC: {
		id: 'EC',
		id3: 'ECU',
		geoRegions: ['South America'],
		title: 'Ecuador',
		emoji: '🇪🇨',
	},
	EG: {
		id: 'EG',
		id3: 'EGY',
		geoRegions: ['Africa'],
		title: 'Egypt',
		emoji: '🇪🇬',
	},
	SV: {
		id: 'SV',
		id3: 'SLV',
		geoRegions: ['North America'],
		title: 'El Salvador',
		emoji: '🇸🇻',
	},
	GQ: {
		id: 'GQ',
		id3: 'GNQ',
		geoRegions: ['Africa'],
		title: 'Equatorial Guinea',
		emoji: '🇬🇶',
	},
	ER: {
		id: 'ER',
		id3: 'ERI',
		geoRegions: ['Africa'],
		title: 'Eritrea',
		emoji: '🇪🇷',
	},
	EE: {
		id: 'EE',
		id3: 'EST',
		geoRegions: ['Europe'],
		title: 'Estonia',
		emoji: '🇪🇪',
	},
	ET: {
		id: 'ET',
		id3: 'ETH',
		geoRegions: ['Africa'],
		title: 'Ethiopia',
		emoji: '🇪🇹',
	},
	FK: {
		id: 'FK',
		id3: 'FLK',
		geoRegions: ['South America'],
		title: 'Falkland Islands (Malvinas)',
		emoji: '🇫🇰',
	},
	FO: {
		id: 'FO',
		id3: 'FRO',
		geoRegions: ['Europe'],
		title: 'Faroe Islands',
		emoji: '🇫🇴',
	},
	FJ: {
		id: 'FJ',
		id3: 'FJI',
		geoRegions: ['Pacific Ocean'],
		title: 'Fiji',
		emoji: '🇫🇯',
	},
	FI: {
		id: 'FI',
		id3: 'FIN',
		geoRegions: ['Europe'],
		title: 'Finland',
		emoji: '🇫🇮',
	},
	FR: {
		id: 'FR',
		id3: 'FRA',
		geoRegions: ['Europe'],
		title: 'France',
		emoji: '🇫🇷',
	},
	GF: {
		id: 'GF',
		id3: 'GUF',
		geoRegions: ['South America'],
		title: 'French Guiana',
		emoji: '🇬🇫',
	},
	PF: {
		id: 'PF',
		id3: 'PYF',
		geoRegions: ['Pacific Ocean'],
		title: 'French Polynesia',
		emoji: '🇵🇫',
	},
	TF: {
		id: 'TF',
		id3: 'ATF',
		geoRegions: ['Pacific Ocean'],
		title: 'French Southern Territories',
		emoji: '🇹🇫',
	},
	GA: {
		id: 'GA',
		id3: 'GAB',
		geoRegions: ['Africa'],
		title: 'Gabon',
		emoji: '🇬🇦',
	},
	GM: {
		id: 'GM',
		id3: 'GMB',
		geoRegions: ['Africa'],
		title: 'Gambia',
		emoji: '🇬🇲',
	},
	GE: {
		id: 'GE',
		id3: 'GEO',
		geoRegions: ['Asia'],
		title: 'Georgia',
		emoji: '🇬🇪',
	},
	DE: {
		id: 'DE',
		id3: 'DEU',
		geoRegions: ['Europe'],
		title: 'Germany',
		emoji: '🇩🇪',
	},
	GH: {
		id: 'GH',
		id3: 'GHA',
		geoRegions: ['Africa'],
		title: 'Ghana',
		emoji: '🇬🇭',
	},
	GI: {
		id: 'GI',
		id3: 'GIB',
		geoRegions: ['Europe'],
		title: 'Gibraltar',
		emoji: '🇬🇮',
	},
	GR: {
		id: 'GR',
		id3: 'GRC',
		geoRegions: ['Europe'],
		title: 'Greece',
		emoji: '🇬🇷',
	},
	GL: {
		id: 'GL',
		id3: 'GRL',
		geoRegions: ['North America'],
		title: 'Greenland',
		emoji: '🇬🇱',
	},
	GD: {
		id: 'GD',
		id3: 'GRD',
		geoRegions: ['North America'],
		title: 'Grenada',
		emoji: '🇬🇩',
	},
	GP: {
		id: 'GP',
		id3: 'GLP',
		geoRegions: ['North America'],
		title: 'Guadeloupe',
		emoji: '🇬🇵',
	},
	GU: {
		id: 'GU',
		id3: 'GUM',
		geoRegions: ['Pacific Ocean'],
		title: 'Guam',
		emoji: '🇬🇺',
	},
	GT: {
		id: 'GT',
		id3: 'GTM',
		geoRegions: ['North America'],
		title: 'Guatemala',
		emoji: '🇬🇹',
	},
	GG: {
		id: 'GG',
		id3: 'GGY',
		geoRegions: ['Europe'],
		title: 'Guernsey',
		emoji: '🇬🇬',
	},
	GN: {
		id: 'GN',
		id3: 'GIN',
		geoRegions: ['Africa'],
		title: 'Guinea',
		emoji: '🇬🇳',
	},
	GW: {
		id: 'GW',
		id3: 'GNB',
		geoRegions: ['Africa'],
		title: 'Guinea-Bissau',
		emoji: '🇬🇼',
	},
	GY: {
		id: 'GY',
		id3: 'GUY',
		geoRegions: ['South America'],
		title: 'Guyana',
		emoji: '🇬🇾',
	},
	HT: {
		id: 'HT',
		id3: 'HTI',
		geoRegions: ['North America'],
		title: 'Haiti',
		emoji: '🇭🇹',
	},
	HM: {
		id: 'HM',
		id3: 'HMD',
		geoRegions: ['Pacific Ocean'],
		title: 'Heard Island and McDonald Islands',
		emoji: '🇭🇲',
	},
	VA: {
		id: 'VA',
		id3: 'VAT',
		geoRegions: ['Europe'],
		title: 'Holy See',
		emoji: '🇻🇦',
	},
	HN: {
		id: 'HN',
		id3: 'HND',
		geoRegions: ['North America'],
		title: 'Honduras',
		emoji: '🇭🇳',
	},
	HK: {
		id: 'HK',
		id3: 'HKG',
		geoRegions: ['Asia'],
		title: 'Hong Kong',
		emoji: '🇭🇰',
	},
	HU: {
		id: 'HU',
		id3: 'HUN',
		geoRegions: ['Europe'],
		title: 'Hungary',
		emoji: '🇭🇺',
	},
	IS: {
		id: 'IS',
		id3: 'ISL',
		geoRegions: ['Europe'],
		title: 'Iceland',
		emoji: '🇮🇸',
	},
	IN: {
		id: 'IN',
		id3: 'IND',
		geoRegions: ['Asia'],
		title: 'India',
		emoji: '🇮🇳',
	},
	ID: {
		id: 'ID',
		id3: 'IDN',
		geoRegions: ['Asia'],
		title: 'Indonesia',
		emoji: '🇮🇩',
	},
	IR: {
		id: 'IR',
		id3: 'IRN',
		geoRegions: ['Asia'],
		title: 'Iran (Islamic Republic of)',
		emoji: '🇮🇷',
	},
	IQ: {
		id: 'IQ',
		id3: 'IRQ',
		geoRegions: ['Asia'],
		title: 'Iraq',
		emoji: '🇮🇶',
	},
	IE: {
		id: 'IE',
		id3: 'IRL',
		geoRegions: ['Europe'],
		title: 'Ireland',
		emoji: '🇮🇪',
	},
	IM: {
		id: 'IM',
		id3: 'IMN',
		geoRegions: ['Europe'],
		title: 'Isle of Man',
		emoji: '🇮🇲',
	},
	IL: {
		id: 'IL',
		id3: 'ISR',
		geoRegions: ['Asia'],
		title: 'Israel',
		emoji: '🇮🇱',
	},
	IT: {
		id: 'IT',
		id3: 'ITA',
		geoRegions: ['Europe'],
		title: 'Italy',
		emoji: '🇮🇹',
	},
	JM: {
		id: 'JM',
		id3: 'JAM',
		geoRegions: ['North America'],
		title: 'Jamaica',
		emoji: '🇯🇲',
	},
	JP: {
		id: 'JP',
		id3: 'JPN',
		geoRegions: ['Asia'],
		title: 'Japan',
		emoji: '🇯🇵',
	},
	JE: {
		id: 'JE',
		id3: 'JEY',
		geoRegions: ['Europe'],
		title: 'Jersey',
		emoji: '🇯🇪',
	},
	JO: {
		id: 'JO',
		id3: 'JOR',
		geoRegions: ['Asia'],
		title: 'Jordan',
		emoji: '🇯🇴',
	},
	KZ: {
		id: 'KZ',
		id3: 'KAZ',
		geoRegions: ['Asia'],
		title: 'Kazakhstan',
		emoji: '🇰🇿',
	},
	KE: {
		id: 'KE',
		id3: 'KEN',
		geoRegions: ['Africa'],
		title: 'Kenya',
		emoji: '🇰🇪',
	},
	KI: {
		id: 'KI',
		id3: 'KIR',
		geoRegions: ['Pacific Ocean'],
		title: 'Kiribati',
		emoji: '🇰🇮',
	},
	KP: {
		id: 'KP',
		id3: 'PRK',
		geoRegions: ['Asia'],
		title: "Korea (Democratic People's Republic of)",
		emoji: '🇰🇵',
	},
	KR: {
		id: 'KR',
		id3: 'KOR',
		geoRegions: ['Asia'],
		title: 'Korea (Republic of)',
		emoji: '🇰🇷',
	},
	KW: {
		id: 'KW',
		id3: 'KWT',
		geoRegions: ['Asia'],
		title: 'Kuwait',
		emoji: '🇰🇼',
	},
	KG: {
		id: 'KG',
		id3: 'KGZ',
		geoRegions: ['Asia'],
		title: 'Kyrgyzstan',
		emoji: '🇰🇬',
	},
	LA: {
		id: 'LA',
		id3: 'LAO',
		geoRegions: ['Asia'],
		title: "Lao People's Democratic Republic",
		emoji: '🇱🇦',
	},
	LV: {
		id: 'LV',
		id3: 'LVA',
		geoRegions: ['Europe'],
		title: 'Latvia',
		emoji: '🇱🇻',
	},
	LB: {
		id: 'LB',
		id3: 'LBN',
		geoRegions: ['Asia'],
		title: 'Lebanon',
		emoji: '🇱🇧',
	},
	LS: {
		id: 'LS',
		id3: 'LSO',
		geoRegions: ['Africa'],
		title: 'Lesotho',
		emoji: '🇱🇸',
	},
	LR: {
		id: 'LR',
		id3: 'LBR',
		geoRegions: ['Africa'],
		title: 'Liberia',
		emoji: '🇱🇷',
	},
	LY: {
		id: 'LY',
		id3: 'LBY',
		geoRegions: ['Africa'],
		title: 'Libya',
		emoji: '🇱🇾',
	},
	LI: {
		id: 'LI',
		id3: 'LIE',
		geoRegions: ['Europe'],
		title: 'Liechtenstein',
		emoji: '🇱🇮',
	},
	LT: {
		id: 'LT',
		id3: 'LTU',
		geoRegions: ['Europe'],
		title: 'Lithuania',
		emoji: '🇱🇹',
	},
	LU: {
		id: 'LU',
		id3: 'LUX',
		geoRegions: ['Europe'],
		title: 'Luxembourg',
		emoji: '🇱🇺',
	},
	MO: {
		id: 'MO',
		id3: 'MAC',
		geoRegions: ['Asia'],
		title: 'Macao',
		emoji: '🇲🇴',
	},
	MK: {
		id: 'MK',
		id3: 'MKD',
		geoRegions: ['Europe'],
		title: 'Macedonia (the former Yugoslav Republic of)',
		emoji: '🇲🇰',
	},
	MG: {
		id: 'MG',
		id3: 'MDG',
		geoRegions: ['Africa'],
		title: 'Madagascar',
		emoji: '🇲🇬',
	},
	MW: {
		id: 'MW',
		id3: 'MWI',
		geoRegions: ['Africa'],
		title: 'Malawi',
		emoji: '🇲🇼',
	},
	MY: {
		id: 'MY',
		id3: 'MYS',
		geoRegions: ['Asia'],
		title: 'Malaysia',
		emoji: '🇲🇾',
	},
	MV: {
		id: 'MV',
		id3: 'MDV',
		geoRegions: ['Asia'],
		title: 'Maldives',
		emoji: '🇲🇻',
	},
	ML: {
		id: 'ML',
		id3: 'MLI',
		geoRegions: ['Africa'],
		title: 'Mali',
		emoji: '🇲🇱',
	},
	MT: {
		id: 'MT',
		id3: 'MLT',
		geoRegions: ['Europe'],
		title: 'Malta',
		emoji: '🇲🇹',
	},
	MH: {
		id: 'MH',
		id3: 'MHL',
		geoRegions: ['Pacific Ocean'],
		title: 'Marshall Islands',
		emoji: '🇲🇭',
	},
	MQ: {
		id: 'MQ',
		id3: 'MTQ',
		geoRegions: ['North America'],
		title: 'Martinique',
		emoji: '🇲🇶',
	},
	MR: {
		id: 'MR',
		id3: 'MRT',
		geoRegions: ['Africa'],
		title: 'Mauritania',
		emoji: '🇲🇷',
	},
	MU: {
		id: 'MU',
		id3: 'MUS',
		geoRegions: ['Africa'],
		title: 'Mauritius',
		emoji: '🇲🇺',
	},
	YT: {
		id: 'YT',
		id3: 'MYT',
		geoRegions: ['Africa'],
		title: 'Mayotte',
		emoji: '🇾🇹',
	},
	MX: {
		id: 'MX',
		id3: 'MEX',
		geoRegions: ['North America'],
		title: 'Mexico',
		emoji: '🇲🇽',
	},
	FM: {
		id: 'FM',
		id3: 'FSM',
		geoRegions: ['Pacific Ocean'],
		title: 'Micronesia (Federated States of)',
		emoji: '🇫🇲',
	},
	MD: {
		id: 'MD',
		id3: 'MDA',
		geoRegions: ['Europe'],
		title: 'Moldova (Republic of)',
		emoji: '🇲🇩',
	},
	MC: {
		id: 'MC',
		id3: 'MCO',
		geoRegions: ['Europe'],
		title: 'Monaco',
		emoji: '🇲🇨',
	},
	MN: {
		id: 'MN',
		id3: 'MNG',
		geoRegions: ['Asia'],
		title: 'Mongolia',
		emoji: '🇲🇳',
	},
	ME: {
		id: 'ME',
		id3: 'MNE',
		geoRegions: ['Europe'],
		title: 'Montenegro',
		emoji: '🇲🇪',
	},
	MS: {
		id: 'MS',
		id3: 'MSR',
		geoRegions: ['North America'],
		title: 'Montserrat',
		emoji: '🇲🇸',
	},
	MA: {
		id: 'MA',
		id3: 'MAR',
		geoRegions: ['Africa'],
		title: 'Morocco',
		emoji: '🇲🇦',
	},
	MZ: {
		id: 'MZ',
		id3: 'MOZ',
		geoRegions: ['Africa'],
		title: 'Mozambique',
		emoji: '🇲🇿',
	},
	MM: {
		id: 'MM',
		id3: 'MMR',
		geoRegions: ['Asia'],
		title: 'Myanmar',
		emoji: '🇲🇲',
	},
	NA: {
		id: 'NA',
		id3: 'NAM',
		geoRegions: ['Africa'],
		title: 'Namibia',
		emoji: '🇳🇦',
	},
	NR: {
		id: 'NR',
		id3: 'NRU',
		geoRegions: ['Pacific Ocean'],
		title: 'Nauru',
		emoji: '🇳🇷',
	},
	NP: {
		id: 'NP',
		id3: 'NPL',
		geoRegions: ['Asia'],
		title: 'Nepal',
		emoji: '🇳🇵',
	},
	NL: {
		id: 'NL',
		id3: 'NLD',
		geoRegions: ['Europe'],
		title: 'Netherlands',
		emoji: '🇳🇱',
	},
	NC: {
		id: 'NC',
		id3: 'NCL',
		geoRegions: ['Pacific Ocean'],
		title: 'New Caledonia',
		emoji: '🇳🇨',
	},
	NZ: {
		id: 'NZ',
		id3: 'NZL',
		geoRegions: ['Pacific Ocean'],
		title: 'New Zealand',
		emoji: '🇳🇿',
	},
	NI: {
		id: 'NI',
		id3: 'NIC',
		geoRegions: ['North America'],
		title: 'Nicaragua',
		emoji: '🇳🇮',
	},
	NE: {
		id: 'NE',
		id3: 'NER',
		geoRegions: ['Africa'],
		title: 'Niger',
		emoji: '🇳🇪',
	},
	NG: {
		id: 'NG',
		id3: 'NGA',
		geoRegions: ['Africa'],
		title: 'Nigeria',
		emoji: '🇳🇬',
	},
	NU: {
		id: 'NU',
		id3: 'NIU',
		geoRegions: ['Pacific Ocean'],
		title: 'Niue',
		emoji: '🇳🇺',
	},
	NF: {
		id: 'NF',
		id3: 'NFK',
		geoRegions: ['Pacific Ocean'],
		title: 'Norfolk Island',
		emoji: '🇳🇫',
	},
	MP: {
		id: 'MP',
		id3: 'MNP',
		geoRegions: ['Pacific Ocean'],
		title: 'Northern Mariana Islands',
		emoji: '🇲🇵',
	},
	NO: {
		id: 'NO',
		id3: 'NOR',
		geoRegions: ['Europe'],
		title: 'Norway',
		emoji: '🇳🇴',
	},
	OM: {
		id: 'OM',
		id3: 'OMN',
		geoRegions: ['Asia'],
		title: 'Oman',
		emoji: '🇴🇲',
	},
	PK: {
		id: 'PK',
		id3: 'PAK',
		geoRegions: ['Asia'],
		title: 'Pakistan',
		emoji: '🇵🇰',
	},
	PW: {
		id: 'PW',
		id3: 'PLW',
		geoRegions: ['Pacific Ocean'],
		title: 'Palau',
		emoji: '🇵🇼',
	},
	PS: {
		id: 'PS',
		id3: 'PSE',
		geoRegions: ['Asia'],
		title: 'Palestine, State of',
		emoji: '🇵🇸',
	},
	PA: {
		id: 'PA',
		id3: 'PAN',
		geoRegions: ['North America'],
		title: 'Panama',
		emoji: '🇵🇦',
	},
	PG: {
		id: 'PG',
		id3: 'PNG',
		geoRegions: ['Pacific Ocean'],
		title: 'Papua New Guinea',
		emoji: '🇵🇬',
	},
	PY: {
		id: 'PY',
		id3: 'PRY',
		geoRegions: ['South America'],
		title: 'Paraguay',
		emoji: '🇵🇾',
	},
	PE: {
		id: 'PE',
		id3: 'PER',
		geoRegions: ['South America'],
		title: 'Peru',
		emoji: '🇵🇪',
	},
	PH: {
		id: 'PH',
		id3: 'PHL',
		geoRegions: ['Asia'],
		title: 'Philippines',
		emoji: '🇵🇭',
	},
	PN: {
		id: 'PN',
		id3: 'PCN',
		geoRegions: ['Pacific Ocean'],
		title: 'Pitcairn',
		emoji: '🇵🇳',
	},
	PL: {
		id: 'PL',
		id3: 'POL',
		geoRegions: ['Europe'],
		title: 'Poland',
		emoji: '🇵🇱',
	},
	PT: {
		id: 'PT',
		id3: 'PRT',
		geoRegions: ['Europe'],
		title: 'Portugal',
		emoji: '🇵🇹',
	},
	PR: {
		id: 'PR',
		id3: 'PRI',
		geoRegions: ['North America'],
		title: 'Puerto Rico',
		emoji: '🇵🇷',
	},
	QA: {
		id: 'QA',
		id3: 'QAT',
		geoRegions: ['Asia'],
		title: 'Qatar',
		emoji: '🇶🇦',
	},
	RE: {
		id: 'RE',
		id3: 'REU',
		geoRegions: ['Africa'],
		title: 'Réunion',
		emoji: '🇷🇪',
	},
	RO: {
		id: 'RO',
		id3: 'ROU',
		geoRegions: ['Europe'],
		title: 'Romania',
		emoji: '🇷🇴',
	},
	RU: {
		id: 'RU',
		id3: 'RUS',
		geoRegions: ['Asia', 'Europe'],
		title: 'Russian Federation',
		emoji: '🇷🇺',
	},
	RW: {
		id: 'RW',
		id3: 'RWA',
		geoRegions: ['Africa'],
		title: 'Rwanda',
		emoji: '🇷🇼',
	},
	BL: {
		id: 'BL',
		id3: 'BLM',
		geoRegions: ['North America'],
		title: 'Saint Barthélemy',
		emoji: '🇧🇱',
	},
	SH: {
		id: 'SH',
		id3: 'SHN',
		geoRegions: ['Africa'],
		title: 'Saint Helena, Ascension and Tristan da Cunha',
		emoji: '🇸🇭',
	},
	KN: {
		id: 'KN',
		id3: 'KNA',
		geoRegions: ['North America'],
		title: 'Saint Kitts and Nevis',
		emoji: '🇰🇳',
	},
	LC: {
		id: 'LC',
		id3: 'LCA',
		geoRegions: ['North America'],
		title: 'Saint Lucia',
		emoji: '🇱🇨',
	},
	MF: {
		id: 'MF',
		id3: 'MAF',
		geoRegions: ['North America'],
		title: 'Saint Martin (French part)',
		emoji: '🇲🇫',
	},
	PM: {
		id: 'PM',
		id3: 'SPM',
		geoRegions: ['North America'],
		title: 'Saint Pierre and Miquelon',
		emoji: '🇵🇲',
	},
	VC: {
		id: 'VC',
		id3: 'VCT',
		geoRegions: ['North America'],
		title: 'Saint Vincent and the Grenadines',
		emoji: '🇻🇨',
	},
	WS: {
		id: 'WS',
		id3: 'WSM',
		geoRegions: ['Pacific Ocean'],
		title: 'Samoa',
		emoji: '🇼🇸',
	},
	SM: {
		id: 'SM',
		id3: 'SMR',
		geoRegions: ['Europe'],
		title: 'San Marino',
		emoji: '🇸🇲',
	},
	ST: {
		id: 'ST',
		id3: 'STP',
		geoRegions: ['Africa'],
		title: 'Sao Tome and Principe',
		emoji: '🇸🇹',
	},
	SA: {
		id: 'SA',
		id3: 'SAU',
		geoRegions: ['Asia'],
		title: 'Saudi Arabia',
		emoji: '🇸🇦',
	},
	SN: {
		id: 'SN',
		id3: 'SEN',
		geoRegions: ['Africa'],
		title: 'Senegal',
		emoji: '🇸🇳',
	},
	RS: {
		id: 'RS',
		id3: 'SRB',
		geoRegions: ['Europe'],
		title: 'Serbia',
		emoji: '🇷🇸',
	},
	SC: {
		id: 'SC',
		id3: 'SYC',
		geoRegions: ['Africa'],
		title: 'Seychelles',
		emoji: '🇸🇨',
	},
	SL: {
		id: 'SL',
		id3: 'SLE',
		geoRegions: ['Africa'],
		title: 'Sierra Leone',
		emoji: '🇸🇱',
	},
	SG: {
		id: 'SG',
		id3: 'SGP',
		geoRegions: ['Asia'],
		title: 'Singapore',
		emoji: '🇸🇬',
	},
	SX: {
		id: 'SX',
		id3: 'SXM',
		geoRegions: ['North America'],
		title: 'Sint Maarten (Dutch part)',
		emoji: '🇸🇽',
	},
	SK: {
		id: 'SK',
		id3: 'SVK',
		geoRegions: ['Europe'],
		title: 'Slovakia',
		emoji: '🇸🇰',
	},
	SI: {
		id: 'SI',
		id3: 'SVN',
		geoRegions: ['Europe'],
		title: 'Slovenia',
		emoji: '🇸🇮',
	},
	SB: {
		id: 'SB',
		id3: 'SLB',
		geoRegions: ['Pacific Ocean'],
		title: 'Solomon Islands',
		emoji: '🇸🇧',
	},
	SO: {
		id: 'SO',
		id3: 'SOM',
		geoRegions: ['Africa'],
		title: 'Somalia',
		emoji: '🇸🇴',
	},
	ZA: {
		id: 'ZA',
		id3: 'ZAF',
		geoRegions: ['Africa'],
		title: 'South Africa',
		emoji: '🇿🇦',
	},
	GS: {
		id: 'GS',
		id3: 'SGS',
		geoRegions: ['Pacific Ocean'],
		title: 'South Georgia and the South Sandwich Islands',
		emoji: '🇬🇸',
	},
	SS: {
		id: 'SS',
		id3: 'SSD',
		geoRegions: ['Africa'],
		title: 'South Sudan',
		emoji: '🇸🇸',
	},
	ES: {
		id: 'ES',
		id3: 'ESP',
		geoRegions: ['Europe'],
		title: 'Spain',
		emoji: '🇪🇸',
	},
	LK: {
		id: 'LK',
		id3: 'LKA',
		geoRegions: ['Asia'],
		title: 'Sri Lanka',
		emoji: '🇱🇰',
	},
	SD: {
		id: 'SD',
		id3: 'SDN',
		geoRegions: ['Africa'],
		title: 'Sudan',
		emoji: '🇸🇩',
	},
	SR: {
		id: 'SR',
		id3: 'SUR',
		geoRegions: ['South America'],
		title: 'Suriname',
		emoji: '🇸🇷',
	},
	SJ: {
		id: 'SJ',
		id3: 'SJM',
		geoRegions: ['Europe'],
		title: 'Svalbard and Jan Mayen',
		emoji: '🇸🇯',
	},
	SZ: {
		id: 'SZ',
		id3: 'SWZ',
		geoRegions: ['Africa'],
		title: 'Swaziland',
		emoji: '🇸🇿',
	},
	SE: {
		id: 'SE',
		id3: 'SWE',
		geoRegions: ['Europe'],
		title: 'Sweden',
		emoji: '🇸🇪',
	},
	CH: {
		id: 'CH',
		id3: 'CHE',
		geoRegions: ['Europe'],
		title: 'Switzerland',
		emoji: '🇨🇭',
	},
	SY: {
		id: 'SY',
		id3: 'SYR',
		geoRegions: ['Asia'],
		title: 'Syrian Arab Republic',
		emoji: '🇸🇾',
	},
	TW: {
		id: 'TW',
		id3: 'TWN',
		geoRegions: ['Asia'],
		title: 'Taiwan',
		emoji: '🇹🇼',
	},
	TJ: {
		id: 'TJ',
		id3: 'TJK',
		geoRegions: ['Asia'],
		title: 'Tajikistan',
		emoji: '🇹🇯',
	},
	TZ: {
		id: 'TZ',
		id3: 'TZA',
		geoRegions: ['Africa'],
		title: 'Tanzania, United Republic of',
		emoji: '🇹🇿',
	},
	TH: {
		id: 'TH',
		id3: 'THA',
		geoRegions: ['Asia'],
		title: 'Thailand',
		emoji: '🇹🇭',
	},
	TL: {
		id: 'TL',
		id3: 'TLS',
		geoRegions: ['Asia'],
		title: 'Timor-Leste',
		emoji: '🇹🇱',
	},
	TG: {
		id: 'TG',
		id3: 'TGO',
		geoRegions: ['Africa'],
		title: 'Togo',
		emoji: '🇹🇬',
	},
	TK: {
		id: 'TK',
		id3: 'TKL',
		geoRegions: ['Pacific Ocean'],
		title: 'Tokelau',
		emoji: '🇹🇰',
	},
	TO: {
		id: 'TO',
		id3: 'TON',
		geoRegions: ['Pacific Ocean'],
		title: 'Tonga',
		emoji: '🇹🇴',
	},
	TT: {
		id: 'TT',
		id3: 'TTO',
		geoRegions: ['North America'],
		title: 'Trinidad and Tobago',
		emoji: '🇹🇹',
	},
	TN: {
		id: 'TN',
		id3: 'TUN',
		geoRegions: ['Africa'],
		title: 'Tunisia',
		emoji: '🇹🇳',
	},
	TR: {
		id: 'TR',
		id3: 'TUR',
		geoRegions: ['Asia', 'Europe'],
		title: 'Turkey',
		emoji: '🇹🇷',
	},
	TM: {
		id: 'TM',
		id3: 'TKM',
		geoRegions: ['Asia'],
		title: 'Turkmenistan',
		emoji: '🇹🇲',
	},
	TC: {
		id: 'TC',
		id3: 'TCA',
		geoRegions: ['North America'],
		title: 'Turks and Caicos Islands',
		emoji: '🇹🇨',
	},
	TV: {
		id: 'TV',
		id3: 'TUV',
		geoRegions: ['Pacific Ocean'],
		title: 'Tuvalu',
		emoji: '🇹🇻',
	},
	UG: {
		id: 'UG',
		id3: 'UGA',
		geoRegions: ['Africa'],
		title: 'Uganda',
		emoji: '🇺🇬',
	},
	UA: {
		id: 'UA',
		id3: 'UKR',
		geoRegions: ['Europe'],
		title: 'Ukraine',
		emoji: '🇺🇦',
	},
	AE: {
		id: 'AE',
		id3: 'ARE',
		geoRegions: ['Asia'],
		title: 'United Arab Emirates',
		emoji: '🇦🇪',
	},
	GB: {
		id: 'GB',
		id3: 'GBR',
		geoRegions: ['Europe'],
		title: 'United Kingdom',
		emoji: '🇬🇧',
	},
	US: {
		id: 'US',
		id3: 'USA',
		geoRegions: ['North America'],
		title: 'United States of America',
		emoji: '🇺🇸',
	},
	UM: {
		id: 'UM',
		id3: 'UMI',
		geoRegions: ['Pacific Ocean'],
		title: 'United States Minor Outlying Islands',
		emoji: '🇺🇲',
	},
	UY: {
		id: 'UY',
		id3: 'URY',
		geoRegions: ['South America'],
		title: 'Uruguay',
		emoji: '🇺🇾',
	},
	UZ: {
		id: 'UZ',
		id3: 'UZB',
		geoRegions: ['Asia'],
		title: 'Uzbekistan',
		emoji: '🇺🇿',
	},
	VU: {
		id: 'VU',
		id3: 'VUT',
		geoRegions: ['Pacific Ocean'],
		title: 'Vanuatu',
		emoji: '🇻🇺',
	},
	VE: {
		id: 'VE',
		id3: 'VEN',
		geoRegions: ['South America'],
		title: 'Venezuela (Bolivarian Republic of)',
		emoji: '🇻🇪',
	},
	VN: {
		id: 'VN',
		id3: 'VNM',
		geoRegions: ['Asia'],
		title: 'Viet Nam',
		emoji: '🇻🇳',
	},
	VG: {
		id: 'VG',
		id3: 'VGB',
		geoRegions: ['North America'],
		title: 'Virgin Islands (British)',
		emoji: '🇻🇬',
	},
	VI: {
		id: 'VI',
		id3: 'VIR',
		geoRegions: ['North America'],
		title: 'Virgin Islands (U.S.)',
		emoji: '🇻🇮',
	},
	WF: {
		id: 'WF',
		id3: 'WLF',
		geoRegions: ['Pacific Ocean'],
		title: 'Wallis and Futuna',
		emoji: '🇼🇫',
	},
	EH: {
		id: 'EH',
		id3: 'ESH',
		geoRegions: ['Africa'],
		title: 'Western Sahara',
		emoji: '🇪🇭',
	},
	YE: {
		id: 'YE',
		id3: 'YEM',
		geoRegions: ['Asia'],
		title: 'Yemen',
		emoji: '🇾🇪',
	},
	ZM: {
		id: 'ZM',
		id3: 'ZMB',
		geoRegions: ['Africa'],
		title: 'Zambia',
		emoji: '🇿🇲',
	},
	ZW: {
		id: 'ZW',
		id3: 'ZWE',
		geoRegions: ['Africa'],
		title: 'Zimbabwe',
		emoji: '🇿🇼',
	},
};

export const unknownCountry: ICountry = {
	id: '--',
	title: 'Unknown',
	geoRegions: [],
	emoji: '🏳️',
};

export const countries: ICountry[] = Object.values(countriesByID);
