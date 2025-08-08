export interface IValueCheckResult {
	ok: boolean;
	message?: string;
}

export interface IValueCheck {
	checkValue(o: unknown): IValueCheckResult;
}
