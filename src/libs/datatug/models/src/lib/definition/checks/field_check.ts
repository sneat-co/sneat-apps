export type FieldCheckType = 'regexp' | 'enum';

export interface IFieldCheck {
	readonly type: FieldCheckType;
	readonly name: string;
	readonly value: unknown;
}

export interface IRegexFieldCheck extends IFieldCheck {
	readonly type: 'regexp';
	readonly value: string;
}

export interface IValidEnumValues {
	valid?: unknown[];
}

export interface IInvalidEnumValues {
	invalid?: unknown[];
}

export interface IEnumFieldCheck extends IFieldCheck {
	readonly type: 'enum';
	readonly value: IValidEnumValues[] | IInvalidEnumValues[];
}
