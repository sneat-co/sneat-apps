import { Pipe, PipeTransform } from '@angular/core';
import { IPersonNames } from '@sneat/auth-models';

@Pipe({ name: 'personNames' })
export class PersonNamesPipe implements PipeTransform {
	transform(names?: IPersonNames): string | undefined {
		if (!names) {
			return undefined;
		}
		if (names.fullName) {
			return names.fullName;
		}
		if (!!names.firstName && !!names.lastName) {
			return `${names.firstName} ${names.lastName}`;
		}
		return JSON.stringify(names);
	}
}

export function personNames(name?: IPersonNames): string | undefined {
	if (!name) {
		return undefined;
	}
	if (name.fullName) {
		return name.fullName;
	}
	if (name.firstName && name.lastName && !name.nickName && !name.middleName) {
		return `${name.firstName} ${name.lastName}`;
	}
	return name.nickName || name.firstName || name.lastName || name.middleName;
}
