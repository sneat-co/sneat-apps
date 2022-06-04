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
}

export interface IDocTypeStandardFields {
	title?: IDocTypeField;
	number?: IDocTypeField;
	issuedBy?: IDocTypeField;
	issuedOn?: IDocTypeField;
	validTill?: IDocTypeField;
}

export const standardFieldsByDocType: { [id: string]: IDocTypeStandardFields } = {
	'other': {
		title: { required: true },
	},
	'passport': {
		number: { required: true },
		validTill: { required: true },
	},
	'driving_license': {
		number: { required: true },
		validTill: { required: true },
	},
	'birth_certificate': {
		number: { required: true },
		issuedBy: {},
		issuedOn: { required: true },
		validTill: { exclude: true },
	},
	'marriage_certificate': {
		number: { required: true },
		issuedBy: {},
		issuedOn: { required: true },
		validTill: { exclude: true },
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
