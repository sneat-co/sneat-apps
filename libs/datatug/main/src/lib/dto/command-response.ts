export interface ICommandResponse {
  readonly commandId: string;
  readonly elapsed?: number;
  readonly items: /*Observable<ICommandResponseItem> |*/ ICommandResponseItem[];
}

export interface ICommandResponseItem {
  type: 'recordset' | 'recordsets' | 'string' | 'integer' | 'object';
  elapsed?: number;
  value?: unknown;
}
