import { InjectionToken } from '@angular/core';
import { SpaceType } from './team-type';

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
	| 'tournament'
	| 'datatug';

export interface IAppInfo {
	readonly appId: SneatApp;
	readonly appTitle: string;
	readonly requiredSpaceType?: SpaceType;
}

export const APP_INFO = new InjectionToken<IAppInfo>('app_info');
