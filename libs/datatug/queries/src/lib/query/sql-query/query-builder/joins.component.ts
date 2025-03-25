import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
	IAstJoin,
	IAstQuery,
	SqlParser,
} from '@sneat/ext-datatug-services-unsorted';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISqlChanged } from '../intefaces';
import {
	ICanJoin,
	QueryContextSqlService,
} from '../../../query-context-sql.service';

@Component({
	selector: 'sneat-datatug-qe-joins',
	templateUrl: 'joins.component.html',
	standalone: false,
})
export class JoinsComponent {
	@Input() public sql?: string;
	@Input() public queryAst?: IAstQuery;
	@Input() public sqlParser?: SqlParser;
	@Output() public astChanged = new EventEmitter<ISqlChanged>();

	public suggestedJoins?: ICanJoin[];

	public readonly trackByIndex = (i: number) => i;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly queryContextSqlService: QueryContextSqlService,
	) {
		queryContextSqlService.suggestedJoins.subscribe({
			next: (suggestedJoins) => {
				this.suggestedJoins = suggestedJoins;
			},
			error: this.errorLogger.logErrorHandler('failed to get suggested join'),
		});
	}

	public joinCheckChanged(event: Event, join: IAstJoin): void {
		console.log('joinCheckChanged', event, join);
		const ce = event as CustomEvent;
		const checked = !!ce.detail.checked;
		if (this.sql) {
			if (checked) {
				this.sql = this.sqlParser?.uncommentJoin(this.sql, join);
			} else {
				this.sql = this.sqlParser?.commentOutJoin(this.sql, join);
			}
		}
		this.queryAst = this.sql ? this.sqlParser?.parseQuery(this.sql) : undefined;
		this.astChanged.emit({ sql: this.sql || '', ast: this.queryAst || {} });
	}

	public addJoin(join: ICanJoin, type: 'left' | 'right' | 'inner'): void {
		alert(`Not implemented yet ${join} ${type}`);
	}
}
