import { Pipe, PipeTransform } from '@angular/core';
import { IIdAndOptionalBriefAndOptionalDto } from '@sneat/core';
import { IPersonNames, IPerson, IPersonBrief } from '@sneat/contactus-core';

export function personName(name?: IPersonNames): string | undefined {
	return (
		name &&
		(name.fullName ||
			name.nickName ||
			name.firstName ||
			name.lastName ||
			name.middleName)
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
