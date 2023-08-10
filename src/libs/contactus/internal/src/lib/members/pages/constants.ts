import { EnumAsUnionOfKeys } from '@sneat/core';

export const enum MemberPage {
	member = 'member',
	'edit-member' = 'edit-member',
	'member-budget' = 'member-budget',
	'member-assets' = 'member-assets',
	'member-contacts' = 'member-contacts',
	'member-documents' = 'member-documents',
	'member-schedule' = 'member-schedule',
	'remove-member' = 'remove-member',
	'member-sizes' = 'person',
}

export type MemberPages = EnumAsUnionOfKeys<typeof MemberPage>;
