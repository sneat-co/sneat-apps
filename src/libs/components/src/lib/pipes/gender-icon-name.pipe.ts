import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'genderIconName' })
export class GenderIconName implements PipeTransform {
	transform(gender?: 'male' | 'female' | 'other' | 'unknown' | 'undisclosed'): string {
		switch (gender) {
			case 'male':
				return 'man-outline';
			case 'female':
				return 'woman-outline';
		}
		return 'person-outline';
	}
}
