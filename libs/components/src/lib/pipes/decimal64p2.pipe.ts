import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'decimal64p2' })
export class Decimal64p2Pipe implements PipeTransform {
	readonly transform = (value?: number) => (value ? value / 100 : 0);
}
