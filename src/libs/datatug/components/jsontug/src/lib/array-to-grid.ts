export interface IJsonGridData {
	cols: string[];
	rows: any[][];
}

export interface IObjectPipe {
	path: string
	tunnel: (o: any) => any;
}

export class CurrencyFlagPipe implements IObjectPipe {
	private readonly code2flag: { [id: string]: string } = {
		'AED': '🇦🇪',
		'AMD': '🇦🇲',
		'EUR': '🇪🇺',
		'USD': '🇺🇸',
		'GBP': '🇬🇧',
		'RUB': '🇷🇺',
	};

	constructor(
		public readonly path: string,
		private readonly currencyProp: string,
		private readonly flagProp: string,
	) {
	}

	public tunnel(o: any): any {
		const v = o[this.currencyProp];
		if (v) {
			const flag = this.code2flag[v];
			if (flag) {
				o = {...o};
				o[this.flagProp] = flag;
			}
		}
		return o;
	}
}


export function arrayToGrid(o: any[], pipes?: IObjectPipe[]): IJsonGridData {
	const data: IJsonGridData = {
		cols: [],
		rows: [],
	}
	o.forEach(item => {
		if (pipes?.length) {
			pipes.forEach(pipe => {
				item = pipe.tunnel(item);
			})
		}
		const keys = Object.keys(item);
		keys.forEach(key => {
			if (data.cols.indexOf(key) < 0) {
				data.cols.push(key);
			}
		});
		const row = new Array(data.cols.length);
		keys.forEach(key => {
			const v = item[key];
			if (v) {
				row[data.cols.indexOf(key)] = v;
			}
		});
		data.rows.push(row);
	})
	return data;
}
