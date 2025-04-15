// TODO: Find a proper "non-auth" library for this file

export interface IPersonNames {
	readonly firstName?: string;
	readonly lastName?: string;
	readonly middleName?: string;
	readonly nickName?: string;
	readonly fullName?: string;
}

export function mustHaveAtLeastOneName(names?: IPersonNames): void {
	if (!names) {
		throw new Error('Names are required');
	}
	if (
		!names.firstName &&
		!names.lastName &&
		!names.middleName &&
		!names.nickName &&
		!names.fullName
	) {
		throw new Error('At least one name is required');
	}
}

export function namesToUrlParams(names?: IPersonNames): string {
	if (!names) {
		return '';
	}
	const { firstName, lastName, middleName, nickName, fullName } = names;
	const params: string[] = [];
	if (firstName) {
		params.push(`firstName=${encodeURIComponent(firstName)}`);
	}
	if (lastName) {
		params.push(`lastName=${encodeURIComponent(lastName)}`);
	}
	if (middleName) {
		params.push(`middleName=${encodeURIComponent(middleName)}`);
	}
	if (nickName) {
		params.push(`nickName=${encodeURIComponent(nickName)}`);
	}
	if (fullName && fullName !== `${firstName} ${lastName}`) {
		params.push(`fullName=${encodeURIComponent(fullName)}`);
	}
	return params.join('&');
}

export function isNameEmpty(n?: IPersonNames): boolean {
	// noinspection UnnecessaryLocalVariableJS
	const result =
		!n ||
		(!n.fullName?.trim() &&
			!n.firstName?.trim() &&
			!n.lastName?.trim() &&
			!n.middleName?.trim() &&
			!n.nickName?.trim());
	return result;
}

export function trimNames(n: IPersonNames): IPersonNames {
	const first = n.firstName?.trim(),
		middle = n.middleName?.trim(),
		last = n.lastName?.trim(),
		full = n.fullName?.trim();
	if (
		first !== n?.firstName ||
		last !== n?.lastName ||
		middle != n.middleName ||
		full != n.fullName
	) {
		n = {
			firstName: first,
			middleName: middle,
			lastName: last,
			fullName: full,
		};
	}
	return n;
}

export function getFullName(n: IPersonNames): string {
	if (n.fullName) {
		return n.fullName;
	}
	return [
		n.firstName,
		n.middleName,
		n.lastName,
		n.nickName ? `(${n.nickName})` : '',
	]
		.filter((v) => !!v)
		.join(' ');
}
