export interface IDbModelBase {
	id: string;
	title?: string;
}

export interface IDbModelFull extends IDbModelBase {
	schemas?: ISchemaModel[];
}

export interface ISchemaModel {
	id: string;
	title?: string;
}
