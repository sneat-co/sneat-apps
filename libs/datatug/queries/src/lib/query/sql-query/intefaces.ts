import { IAstQuery } from '@sneat/ext-datatug-services-unsorted';

export interface ISqlChanged {
	sql: string;
	ast: IAstQuery;
}
