import {Component, EventEmitter, Inject, Input, Output} from "@angular/core";
import {IAstJoin, IAstQuery, ICanJoin, QueryContextSqlService, SqlParser} from "@sneat/datatug/services/unsorted";
import {ErrorLogger, IErrorLogger} from "@sneat/logging";
import {ISqlChanged} from "../intefaces";



@Component({
	selector: 'datatug-qe-joins',
	templateUrl: 'joins.component.html',
})
export class JoinsComponent {
	@Input() public sql: string;
	@Input() public queryAst: IAstQuery;
	@Input() public sqlParser: SqlParser;
	@Output() public astChanged = new EventEmitter<ISqlChanged>();

	public suggestedJoins: ICanJoin[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly queryContextSqlService: QueryContextSqlService,
	) {
		queryContextSqlService.suggestedJoins.subscribe({
			next: suggestedJoins => {
				this.suggestedJoins = suggestedJoins;
			},
			error: this.errorLogger.logErrorHandler('failed to get suggested join'),
		});
	}

	public trackByIndex = (i: number) => i;

	public joinCheckChanged(event: CustomEvent, join: IAstJoin): void {
		console.log('joinCheckChanged', event, join);
		const checked = !!event.detail.checked;
		if (checked) {
			this.sql = this.sqlParser.uncommentJoin(this.sql, join);
		} else {
			this.sql = this.sqlParser.commentOutJoin(this.sql, join);
		}
		this.queryAst = this.sqlParser.parseQuery(this.sql);
		this.astChanged.emit({sql: this.sql, ast: this.queryAst});
	}

}
