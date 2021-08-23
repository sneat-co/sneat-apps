import {IValueCheck, IValueCheckResult} from '../interfaces';

export class RegexpCheck implements IValueCheck {
	private readonly regExp: RegExp;

	constructor(regExp: RegExp) {
		this.regExp = regExp.compile()
	}

	checkValue(o: unknown): IValueCheckResult {
		const s = '' + o;
		const m = s.match(this.regExp);
		if (m) {
			return {ok: true}
		}
		return {ok: false, message: `does not match regular expression: ${this.regExp}`}
	}
}
