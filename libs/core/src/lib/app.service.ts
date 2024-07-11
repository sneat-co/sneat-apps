import { InjectionToken } from '@angular/core';
import { SpaceType } from './space-type';

export type SneatApp =
	| 'sneat'
	| 'aaproject'
	| 'agendum'
	| 'class'
	| 'contactus'
	| 'creche'
	| 'debtus'
	| 'docus'
	| 'dream7'
	| 'feis'
	| 'logist'
	| 'listus'
	| 'neighbours'
	| 'parish'
	| 'renterra'
	| 'rsvp'
	| 'sizechart'
	| 'splitus'
	| 'sportclubs'
	| 'tournament';

export interface IAppInfo {
	readonly appId: SneatApp;
	readonly appTitle: string;
	readonly requiredTeamType?: SpaceType;
}

export const APP_INFO = new InjectionToken<IAppInfo>('app');
