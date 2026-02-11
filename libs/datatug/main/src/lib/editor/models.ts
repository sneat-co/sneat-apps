import { IExecuteResponse, IRecordset } from '../dto/execute';
import {
  IEnvDbServer,
  IEnvironmentSummary,
} from '../models/definition/environments';
import { IParameter } from '../models/definition/parameter';
import { IProjDbModelBrief } from '../models/definition/project';
import {
  IQueryDef,
  IQueryRequest,
  QueryType,
} from '../models/definition/query-def';

export interface IQueryEditorState {
  readonly currentQueryId?: string;
  readonly activeQueries: ReadonlyArray<IQueryState>;
}

export interface IQueryStateDto {
  // This interface does not holds ID prop as we store data by query ID
  readonly queryType: QueryType; // Is it duplicate? we have same on def.request.queryType
  readonly def?: IQueryDef;
}

export interface IQueryEnvState {
  readonly id: string;
  readonly title?: string;
  readonly summary?: IEnvironmentSummary;
  readonly isExecuting?: boolean;
  readonly parameters?: ReadonlyArray<IParameter>;
  readonly recordsets?: ReadonlyArray<IRecordset>;
  readonly rowsCount?: number;
  readonly dbServerId?: string;
  readonly dbServer?: IEnvDbServer;
  readonly catalogId?: string;
  readonly error?: unknown;
}

export interface IQueryState extends IQueryStateDto {
  readonly id?: string;
  readonly isNew?: boolean;
  readonly title?: string;
  readonly request?: IQueryRequest;
  readonly response?: IExecuteResponse;
  readonly targetDbModel?: IProjDbModelBrief;
  readonly activeEnv?: IQueryEnvState;
  readonly environments?: ReadonlyArray<IQueryEnvState>;
  readonly isSaving?: boolean;
  readonly isLoading?: boolean;
}
