import {
  IEnumFieldCheck,
  IFieldCheckDef,
  IRegexFieldCheck,
} from '../../models/definition/checks/field-checks';
import { EnumValidCheck } from './enum_check';
import { RegExpCheck } from './regexp_check';
import { IValueCheck } from './interfaces';

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
