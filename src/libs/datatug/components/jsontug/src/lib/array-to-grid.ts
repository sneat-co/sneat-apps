export interface IJsonGridData {
	cols: string[];
	rows: any[][];
}

export function arrayToGrid(o: any[]): IJsonGridData {
	const data: IJsonGridData = {
		cols: [],
		rows: [],
	}
	o.forEach(item => {
		const keys = Object.keys(item);
		keys.forEach(key => {
			if (data.cols.indexOf(key) < 0) {
				data.cols.push(key);
			}
		});
		const row = new Array(data.cols.length);
		keys.forEach(key => row[data.cols.indexOf(key)] = item[key]);
		data.rows.push(row);
	})
	return data;
}
