import {IPipeDefinition} from '../definition/pipe-definition';
import {IParameterValueWithoutID} from "../definition";


export type NamedParams = { [name: string]: IParameterValueWithoutID };

export interface IRequestCommand {
	id?: string;
	readonly type: 'SQL' | 'HTTP';
	namedParams?: NamedParams;
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
	driver?: string;
}
