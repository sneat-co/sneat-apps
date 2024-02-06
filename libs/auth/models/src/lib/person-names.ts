// TODO: Find a proper "non-auth" library for this file

export interface IPersonNames {
	readonly firstName?: string;
	readonly lastName?: string;
	readonly middleName?: string;
	readonly nickName?: string;
	readonly fullName?: string;
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
