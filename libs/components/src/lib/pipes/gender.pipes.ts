import { Pipe, PipeTransform } from '@angular/core';
import { Gender } from '@sneat/contactus-core';

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

@Pipe({ name: 'genderColor' })
export class GenderColorPipe implements PipeTransform {
	transform(
		gender?: Gender,
	): 'medium' | 'warning' | 'dark' | 'danger' | 'primary' {
		switch (gender) {
			case 'male':
				return 'primary';
			case 'female':
				return 'danger';
			case 'other':
				return 'warning';
			case 'unknown':
				return 'medium';
			case 'undisclosed':
				return 'medium';
		}
		return 'dark';
	}
}
