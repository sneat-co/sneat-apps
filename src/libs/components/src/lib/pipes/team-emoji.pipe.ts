import { Pipe, PipeTransform } from '@angular/core';
import { TeamType } from '@sneat/core';

@Pipe({ name: 'teamEmoji' })
export class TeamEmojiPipe implements PipeTransform {
	// tslint:disable-next-line:prefer-function-over-method
	transform(communeType: TeamType): string | undefined {
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
			case 'personal':
				return '🕶️';
			default:
				return undefined;
		}
	}
}
