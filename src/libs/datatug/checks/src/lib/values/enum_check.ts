import { IValueCheck, IValueCheckResult } from './interfaces';

export class EnumValidCheck implements IValueCheck {
	constructor(private readonly values: unknown[]) {
	}

	checkValue(o: unknown): IValueCheckResult {
		if (this.values.some((v) => v === o)) {
			return { ok: true };
		}
		return {
			ok: false,
			message: `does not match any of known values: ${this.values.join(', ')}`,
		};
	}
}
