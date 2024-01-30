import { CommunePages } from '../constants';
import { CommuneType, PreloadPages } from '@sneat/core';

export interface CommuneMenuItem {
	code: string;
	defaultEmoji?: string;
	byCommuneType?: Record<
		string,
		{
			emoji?: string;
			title?: string;
		}
	>;
	defaultTitle: string;
	pages: {
		main: CommunePages | undefined;
		new?: CommunePages;
	};
	newDefaultTitle?: string;
	counter?: string;
	experimental?: boolean;
	communeTypes?: CommuneType[];
	excludeCommuneType?: CommuneType[];
	isNotImplementedYet?: boolean;
	communeSupports?: 'staff' | 'pupils';
	preload?: PreloadPages;
}
