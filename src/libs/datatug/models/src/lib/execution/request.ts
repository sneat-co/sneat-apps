import {IRequestCommand} from '../requests/command';

export interface IExecuteRequest {
	id: string;
	projectId?: string; // This is better to pass throw a query parameter
	commands: IRequestCommand[];
}
