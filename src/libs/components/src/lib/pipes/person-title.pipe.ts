import { Pipe, PipeTransform } from '@angular/core';
import { IName } from '@sneat/dto';
import { IPersonContext } from '@sneat/team/models';

export function personName(name?: IName): string | undefined {
	return name && (name.full || name.first || name.last || name.middle);
}

@Pipe({ name: 'personTitle' })
export class PersonTitle implements PipeTransform {
	transform(p?: IPersonContext, shortTitle?: string): string {
		return shortTitle || personName(p?.brief?.name) || p?.brief?.title || p?.id || 'NO TITLE';
	}
}
