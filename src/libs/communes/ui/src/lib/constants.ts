// import {ListPages} from '../extensions/listus/constants';

import { EnumAsUnionOfKeys } from '@sneat/core';

export const enum CommuneTopPage {
	home = 'home',
	applicants = 'applicants',
	assets = 'assets',
	bills = 'bills',
	budget = 'budget',
	contacts = 'contacts',
	documents = 'documents',
	groups = 'groups',
	members = 'members',
	landlords = 'landlords',
	lists = 'lists',
	schedule = 'schedule',
	tasks = 'tasks',
	tenants = 'tenants',
	terms = 'terms',
	pupils = 'pupils',
	sizes = 'sizes',
	staff = 'staff',
	asset = 'asset',
	vehicles = 'vehicles'
}

export type CommuneTopPages = EnumAsUnionOfKeys<typeof CommuneTopPage> | 'real-estates' | 'commune-settings';

export type CommunePages = CommuneTopPages
	// | ListPages
	// | MemberPages
	| 'add-dwelling'
	| 'add-vehicle'
	| 'add-service'
	| 'add-to-watch'
	| 'asset'
	| 'assets-group'
	| 'commune-settings'
	| 'contact'
	| 'document'
	| 'event'
	| 'group'
	| 'new-happening'
	| 'new-asset'
	| 'new-contact'
	| 'new-document'
	| 'new-member'
	| 'new-group'
	| 'new-liability'
	| 'new-list'
	| 'new-staff'
	| 'new-task'
	| 'new-term'
	| 'property'
	| 'real-estates'
	| 'recipe'
	| 'recipes'
	| 'regular-activity'
	| 'regular-task'
	| 'rsvp'
	| 'savings'
	| 'select-provider'
	| 'task'
	| 'term'
	| 'to-buy'
	| 'to-do'
	| 'to-watch'
	| 'vehicle'
	| 'movie-info'
	;
