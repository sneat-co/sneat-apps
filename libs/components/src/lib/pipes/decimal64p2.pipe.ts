import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'decimal64p2',
	standalone: false,
})
export class Decimal64p2Pipe implements PipeTransform {
	readonly transform = (value?: number) => (value ? value / 100 : 0);
}

@Pipe({
	name: 'numeral',
	standalone: false,
})
export class Numeral2Pipe implements PipeTransform {
	readonly transform = (value?: number | string) => {
		const s = value?.toString();
		if (s?.endsWith('1')) {
			return value + 'st';
		}
		if (
			s === '13' ||
			s?.endsWith('4') ||
			s?.endsWith('5') ||
			s?.endsWith('6') ||
			s?.endsWith('7') ||
			s?.endsWith('8') ||
			s?.endsWith('9') ||
			s?.endsWith('0')
		) {
			return value + 'th';
		}
		if (s?.endsWith('2')) {
			return value + 'nd';
		}
		if (s?.endsWith('3')) {
			return value + 'd';
		}
		return value;
	};
}
