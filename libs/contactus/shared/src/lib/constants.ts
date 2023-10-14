import { EnumAsUnionOfKeys } from '@sneat/core';

export const enum MemberPageID { // Read README-DEV-FAQ.md#enum-as-union-of-keys
	member = 'member',
	'edit-member' = 'edit-member',
	'member-budget' = 'member-budget',
	'member-assets' = 'member-assets',
	'member-contacts' = 'member-contacts',
	'member-documents' = 'member-documents',
	'member-schedule' = 'member-schedule',
	'remove-member' = 'remove-member',
	'member-sizes' = 'member-sizes',
}

export type MemberPages = EnumAsUnionOfKeys<typeof MemberPageID>; // Read README-DEV-FAQ.md#enum-as-union-of-keys
