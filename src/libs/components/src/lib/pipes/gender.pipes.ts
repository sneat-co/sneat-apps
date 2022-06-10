import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '@sneat/dto';

@Pipe({ name: 'genderIconName' })
export class GenderIconNamePipe implements PipeTransform {
	transform(gender?: Gender): string {
		switch (gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
			case 'other':
				return 'person-circle-outline';
			case 'unknown':
				return 'person-outline';
			case 'undisclosed':
				return 'person';
		}
		return 'person-outline';
	}
}

@Pipe({ name: 'genderEmoji' })
export class GenderEmojiPipe implements PipeTransform {
	transform(gender?: Gender): string {
		switch (gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
		}
		return 'person-outline';
	}
}
