import { Pipe, PipeTransform } from '@angular/core';
import { IPersonNames } from '@sneat/auth-models';
import { IIdAndOptionalBriefAndOptionalDto } from '@sneat/core';
import { IPerson, IPersonBrief } from '@sneat/contactus-core';

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
			personName(p?.brief?.names) ||
			p?.id ||
			'NO TITLE'
		);
	}
}

@Pipe({ name: 'personNames' })
export class PersonNamesPipe implements PipeTransform {
	transform(names?: IPersonNames): string | undefined {
		if (!names) {
			return undefined;
		}
		if (names.fullName) return names.fullName;
		if (!!names.firstName && !!names.lastName) {
			return `${names.firstName} ${names.lastName}`;
		}
		return JSON.stringify(names);
	}
}
