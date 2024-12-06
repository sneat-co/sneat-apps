import { Pipe, PipeTransform } from '@angular/core';
import { SpaceType } from '@sneat/core';

@Pipe({
	name: 'spaceEmoji',
	standalone: false,
})
export class SpaceEmojiPipe implements PipeTransform {
	transform(communeType: SpaceType): string | undefined {
		switch (communeType) {
			case 'family':
				return '👨‍👩‍👧‍👦';
			case 'cohabit':
				return '🤝';
			case 'sport_club':
				return '⚽';
			case 'educator':
				return '💃';
			case 'realtor':
				return '🏘️';
			case 'parish':
				return '⛪';
			case 'private':
				return '🕶️';
			default:
				return undefined;
		}
	}
}
