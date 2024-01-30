import { IAstQuery } from '@sneat/datatug-services-unsorted';

export interface ISqlChanged {
	sql: string;
	ast: IAstQuery;
}
