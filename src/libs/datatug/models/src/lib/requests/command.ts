import {IPipeDefinition} from '../definition/pipe-definition';


export interface IRequestCommand {
	id?: string;
	readonly type: 'SQL' | 'HTTP';
	namedParams?: { [name: string]: string };
	pipes?: IPipeDefinition[];
}

export interface IHttpCommand {
	readonly type: 'HTTP';
	url: string;
}

export interface ISqlCommandRequest extends IRequestCommand {
	readonly type: 'SQL';
	text: string;
	env: string
	db: string;
}
