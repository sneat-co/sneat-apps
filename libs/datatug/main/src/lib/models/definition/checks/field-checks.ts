// Defines know types for field checks
export type FieldCheckType = 'regexp' | 'enum' | 'ref';

// Base interface for a field check
export interface IFieldCheckDef {
	readonly type: FieldCheckType;
	readonly value: unknown;
	readonly title?: string;
}

// Holds a reference to a shared check
export interface IFieldCheckRef extends IFieldCheckDef {
	readonly type: 'ref';
	readonly value: string;
}

// Defines a field check that validates value with a regular expression
export interface IRegexFieldCheck extends IFieldCheckDef {
	readonly type: 'regexp';
	readonly value: string;
}

// Defines a check that validates field value against list of value
export interface IEnumFieldCheck extends IFieldCheckDef {
	readonly type: 'enum';
	readonly value: unknown[];
}
