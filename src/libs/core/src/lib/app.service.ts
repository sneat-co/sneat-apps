import { InjectionToken } from '@angular/core';

export type SneatApp = 'sneat'
	| 'aaproject'
	| 'agendum'
	| 'class'
	| 'contactus'
	| 'creche'
	| 'debtus'
	| 'docus'
	| 'dream7'
	| 'feis'
	| 'listus'
	| 'neighbours'
	| 'parish'
	| 'renterra'
	| 'rsvp'
	| 'sizechart'
	| 'splitus'
	| 'sportclubs'
	| 'tournament'
	;

export interface IAppInfo {
	readonly appId: SneatApp;
	readonly appTitle: string;
}

export const APP_INFO = new InjectionToken<IAppInfo>('app');
