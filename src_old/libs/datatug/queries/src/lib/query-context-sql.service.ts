import { Inject, Injectable } from '@angular/core';
import { IForeignKey, ISqlQueryTarget, ITableFull } from '@sneat/datatug/models';
import { BehaviorSubject } from 'rxjs';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAstQuery,
	IAstRecordset,
	IDbCatalogObjectWithRefs,
	SqlParser,
	TableService,
} from '@sneat/datatug/services/unsorted';

const equalRecordsets = (a?: IAstRecordset, b?: IAstRecordset): boolean =>
	(!a && !b) || a?.name === b?.name && a?.schema === b?.schema;

@Injectable()
export class QueryContextSqlService {
	private readonly sqlParser = new SqlParser();

	private target?: ISqlQueryTarget;
	private catalog?: string;
	private repository?: string;
	private server?: string;
	private sql?: string;
	private ast?: IAstQuery;
	private tables: ITableFull[] = [];
	private dbCatalogRefs?: IDbCatalogObjectWithRefs[];

	private _suggestedJoins = new BehaviorSubject<ICanJoin[] | undefined>(undefined);

	public readonly suggestedJoins = this._suggestedJoins.asObservable();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly tableService: TableService,
	) {
	}

	private static getAutoAlias(name: string): string {
		throw new Error('Not implemented yet');
	}

	public setTarget(target: ISqlQueryTarget): void {
		this.target = target;
		this.tableService.getDbCatalogRefs(target).subscribe({
			next: (dbCatalogRefs) => {
				this.dbCatalogRefs = dbCatalogRefs;
				this.updateMeta();
			},
			error: this.errorLogger.logErrorHandler(`failed to get DB catalog ref`),
		});
	}

	public setSql(sql: string): IAstQuery {
		if (!sql) {
			throw new Error('sql is a required parameter');
		}
		this.sql = sql;
		this.ast = this.sqlParser.parseQuery(sql);
		requestAnimationFrame(() => {
			this.updateMeta();
		});
		return this.ast;
	}

	private allAstRecordset(): IAstRecordset[] {
		// console.log('allAstRecordset(): ast:', this.ast)
		return this.ast ? [
			...(this.ast.from && [this.ast.from] || []),
			...(this.ast.joins || []),
		] : []; //.filter(rs => this.tables.find(t => t.name === rs.name && t.schema === rs.schema));
	}

	private updateMeta(): void {
		const recordsets = this.allAstRecordset();
		// console.log('updateMeta(): recordsets:', recordsets, 'SQL:', this.sql);
		recordsets?.forEach((rs) => {
			this.updateSuggestedJoins(rs);
			// this.tableService
			//   .getTableMeta({...this.target, schema: rs.schema, name: rs.name})
			//   .subscribe({
			//     next: this.processTable,
			//     error: this.errorLogger.logErrorHandler(
			//       `failed to load table metadata for [${rs.schema}].[${rs.name}]`),
			//   });
		});
	}

	private processTable = (table: ITableFull): void => {
		if (
			!this.tables.find(
				(t) => t.name === table.name && t.schema == table.schema,
			)
		) {
			this.tables.push(table);
		}
		this.updateSuggestedJoins(table);
	};

	private updateSuggestedJoins(recordset: IAstRecordset): void {
		// const recordset = this.allAstRecordset().find(rs => rs.name === table.name && rs.schema === table.schema);
		if (!recordset) {
			return;
		}

		const table = this.dbCatalogRefs?.find(
			(o) => o.name === recordset.name && o.schema === recordset.schema,
		);
		if (!table) {
			return;
		}
		if (table.foreignKeys?.length) {
			this.updateSuggestedJoinForForeignKeys(recordset, table);
		}
		if (table.referencedBy?.length) {
			this.updateSuggestedJoinForRefsBy(recordset, table);
		}
	}

	private getSuggestedJoinByToRecordset(rs: IAstRecordset): ICanJoin | undefined {
		const suggestedJoin = this._suggestedJoins.value?.find(
			(sj: ICanJoin) =>
				sj.to?.recordset?.name === rs.name && sj.to?.recordset?.schema === rs.schema,
		);
		return suggestedJoin;
	}

	private updateSuggestedJoinForRefsBy(
		rs: IAstRecordset,
		table: IDbCatalogObjectWithRefs,
	): void {
		return this.updateSuggestedJoinFor(
			table,
			'refBy',
			table.referencedBy ? table.referencedBy.map((refBy) => ({
				rs: { schema: refBy.schema, name: refBy.name },
			})) : [],
		);
	}

	private updateSuggestedJoinForForeignKeys(
		rs: IAstRecordset,
		table: IDbCatalogObjectWithRefs,
	): void {
		return this.updateSuggestedJoinFor(
			table,
			'fk',
			table.foreignKeys && table.foreignKeys.map((fk) => ({
				fk,
				rs: { schema: fk.refTable.schema, name: fk.refTable.name },
			})) || [],
		);
	}

	private updateSuggestedJoinFor(
		table: IDbCatalogObjectWithRefs,
		reason: JoinReason,
		tos: IJoinToRef[],
	): void {
		let joins = [...(this._suggestedJoins.value || [])];
		let updated = false;
		tos.forEach((to) => {
			let sj = this.getSuggestedJoinByToRecordset(to.rs);
			const from = sj?.from?.find(
				(f) => f.reason === reason && equalRecordsets(f.recordset, to.rs),
			);
			if (from) {
				return;
			}
			updated = true;
			if (sj) {
				sj = {
					...sj,
					from: [
						...(sj.from || []),
						{ recordset: to.rs, fk: to.fk, table, reason },
					],
				};
				joins = joins.map((j) =>
					sj && equalRecordsets(j.to?.recordset, to?.rs) ? sj : j,
				);
			} else {
				joins.push({
					to: { recordset: to.rs },
					from: [{ recordset: to.rs, fk: to.fk, table, reason }],
				});
			}
		});
		if (updated) {
			this._suggestedJoins.next(joins);
		}
	}
}

interface IJoinToRef {
	rs: IAstRecordset;
	fk?: IForeignKey;
}

export type JoinReason = 'fk' | 'refBy';

export interface IJoinFrom {
	reason: JoinReason;
	recordset: IAstRecordset;
	table: IDbCatalogObjectWithRefs;
	fk?: IForeignKey;
}

export interface IJoinTo {
	recordset?: IAstRecordset;
	table?: IDbCatalogObjectWithRefs;
}

export interface ICanJoin {
	from: IJoinFrom[];
	to?: IJoinTo;
}
