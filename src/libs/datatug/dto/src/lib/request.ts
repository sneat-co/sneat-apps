import {IRequestCommand} from "./requests";

export interface IExecuteRequest {
	id: string;
	projectId?: string; // This is better to pass throw a query parameter
	commands: IRequestCommand[];
}
