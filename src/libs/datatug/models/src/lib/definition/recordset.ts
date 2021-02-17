export interface IRecordset {
	name: string;
	fields?: IRecordsetField[];
}

export interface IRecordsetField {
	name: string;
	type: string;
	meta?: IEntityFieldRef;
}

export interface IEntityFieldRef {
	entity: string;
	field: string;
}

// This is used to mark source of a field in Views, SP & queries
export interface IRecordsetFieldRef {
	recordset: string;
	field: string;
}
