import { IAstQuery } from '../../../services/unsorted/sql-parser';

export interface ISqlChanged {
  sql: string;
  ast: IAstQuery;
}
