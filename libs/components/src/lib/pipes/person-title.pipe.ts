import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndOptionalBriefAndOptionalDto } from '@sneat/core';
import { IName, IPerson, IPersonBrief } from '@sneat/contactus-core';

export function personName(name?: IName): string | undefined {
	return (
		name && (name.full || name.nick || name.first || name.last || name.middle)
	);
}

@Pipe({ name: 'personTitle' })
export class PersonTitle implements PipeTransform {
	transform(
		p?: IIdAndOptionalBriefAndOptionalDto<IPersonBrief, IPerson>,
		shortTitle?: string,
	): string {
		return (
			shortTitle ||
			p?.dto?.title ||
			p?.brief?.title ||
			personName(p?.brief?.name) ||
			p?.id ||
			'NO TITLE'
		);
	}
}
