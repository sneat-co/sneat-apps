import { IWithAssetIDs, IWithMemberIDs, IWithTag } from './dto-models';

export type SneatDocType =
	'unspecified' |
	'other' |
	'passport' |
	'driving_license' |
	'birth_certificate' |
	'marriage_certificate';

export interface IDocTypeField {
	type?: 'str' | 'int' | 'date';
	required?: boolean;
	exclude?: boolean;
	max?: number;
	min?: number;
}

export interface IDocTypeStandardFields {
	title?: IDocTypeField;
	number?: IDocTypeField;
	issuedBy?: IDocTypeField;
	issuedOn?: IDocTypeField;
	validTill?: IDocTypeField;
	members?: IDocTypeField;
}

export interface DocTypeDef {
	id: SneatDocType;
	title: string;
	emoji?: string;
	fields?: IDocTypeStandardFields;
}


export const standardDocTypesByID: { [id: string]: DocTypeDef } = {
	'other': {
		id: 'other',
		title: 'Other',
		fields: {
			title: { required: true },
		},
	},
	'passport': {
		id: 'passport',
		title: 'Passport',
		emoji: '🛂',
		fields: {
			number: { required: true },
			validTill: { required: true },
			members: { max: 1 },
		},
	},
	'driving_license': {
		id: 'driving_license',
		title: 'Driving license',
		emoji: '🚗',
		fields: {
			number: { required: true },
			validTill: { required: true },
			members: { max: 1 },
		},
	},
	'birth_certificate': {
		id: 'birth_certificate',
		title: 'Birth certificate',
		emoji: '👼',
		fields: {
			number: { required: true },
			issuedBy: {},
			issuedOn: { required: true },
			validTill: { exclude: true },
			members: { max: 1 },
		},
	},
	'marriage_certificate': {
		id: 'marriage_certificate',
		title: 'Marriage certificate',
		emoji: '💒',
		fields: {
			number: { required: true },
			issuedBy: {},
			issuedOn: { required: true },
			validTill: { exclude: true },
			members: { max: 2 },
		},
	},
};

export interface IDocumentBase {
	type: SneatDocType;
	title: string;
	countryID?: string;
	issuedOn?: string; // ISO date string 'YYYY-MM-DD'
	issuedBy?: string;
	expiresOn?: string; // ISO date string 'YYYY-MM-DD'
}

export interface IDocumentBrief extends IDocumentBase {
	id: string;
}

export interface IDocData {
	number?: string;
	batchNumber?: string;
}

export interface IDocumentDto
	extends IDocumentBase,
		IDocData,
		IWithTag,
		IWithAssetIDs,
		IWithMemberIDs {
}
