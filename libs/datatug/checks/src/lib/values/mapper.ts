import {
	IEnumFieldCheck,
	IFieldCheckDef,
	IRegexFieldCheck,
} from '@sneat/ext-datatug-models';
import { RegExpCheck } from './regexp_check';
import { IValueCheck } from './interfaces';
import { EnumValidCheck } from '@sneat/ext-datatug-checks';

export const newFieldCheckFromDef = (def: IFieldCheckDef): IValueCheck => {
	switch (def.type) {
		case 'regexp':
			return new RegExpCheck(new RegExp((def as IRegexFieldCheck).value));
		case 'enum':
			return new EnumValidCheck((def as IEnumFieldCheck).value);
		default:
			throw new Error(`unknown field check type: ${def.type}`);
	}
};
