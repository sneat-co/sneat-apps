export interface IAstRecordset {
	schema?: string;
	name: string;
	alias?: string;
}

type JoinType = 'inner' | 'left' | 'right' | 'cross';

export interface IAstJoin extends IAstRecordset {
	side: JoinType;
	comment?: string;
	disabled?: boolean;
	match: RegExpMatchArray;
}

export interface IAstQuery {
	readonly from?: IAstRecordset;
	readonly joins?: IAstJoin[];
	readonly orderBy?: string[];
}

export class SqlParser {
	// private readonly reFrom = .compile();
	// private readonly reJoin = .compile();
	//a = //
	// This is a global regex - be careful
	private readonly reJoin =
		/((?:--*\s*)?)(?:(INNER|LEFT|RIGHT|CROSS)\s+?)JOIN\s+(?:(?:(\w+)\.)?(\w+))(?:(?:\s+AS)?\s+(\w+))(?:\s+ON\s+(.+?\n))?/gi;
	// private readonly reJoin = /(?<=\s+)(--+\s*)?(?:(INNER|LEFT|RIGHT|CROSS)\s+?)JOIN\s+(?:(?:(\w+)\.)(\w+))(?:(?:\s+AS)?\s+(\w+))?(?:\s+ON\s+(.+?\n))?/ig;
	private readonly reFrom =
		/FROM\s+(?:(?:(\w+)\.)(\w+))(?:(?:\s+AS)?\s+(\w+))?/i;
	private readonly reOrderBy = /ORDER\s+BY\s+(.+)$/i;

	public parseQuery(text: string): IAstQuery {
		if (!text && text !== '') {
			throw new Error('text is a required parameter');
		}
		let q: IAstQuery = { joins: [], orderBy: [] };
		const from = text.match(this.reFrom);
		if (from) {
			q = {
				...q,
				from: {
					schema: from[1] || 'dbo',
					name: from[2],
					alias: from[3],
				},
			};
		}
		let m: RegExpMatchArray | null;
		while ((m = this.reJoin.exec(text)) !== null) {
			console.log(m);
			if (m) {
				q.joins?.push({
					match: m,
					comment: m[1],
					disabled: !!m[1],
					side: m[2] as JoinType,
					schema: m[3] || 'dbo',
					name: m[4],
					alias: m[5],
				});
			}
		}
		const orderBy = text.match(this.reOrderBy);
		if (orderBy) {
			const orderCols = orderBy[1].split(',');
			q = { ...q, orderBy: orderCols.map((c) => c.trim()).filter((c) => !!c) };
		}
		return q;
	}

	public commentOutJoin(text: string, join: IAstJoin): string {
		console.log('commentOutJoin', join);
		if (!join.match.index || join.match.index !== 0) {
			return text;
		}
		const joinSql = text.substr(join.match.index, join.match.length);

		return (
			text.substr(0, join.match.index) +
			'--' +
			joinSql +
			text.substring(join.match.index + join.match.length)
		);
	}

	public uncommentJoin(text: string, join: IAstJoin): string {
		if (!join.match.index && join.match.index !== 0) {
			return text;
		}
		const joinSql = text.substr(join.match.index, join.match.length);
		console.log('uncommentJoin', text, joinSql, join);
		return (
			text.substr(0, join.match.index) +
			(join.comment ? joinSql.replace(join.comment, '') : joinSql) +
			text.substring(join.match.index + join.match.length)
		);
	}
}
