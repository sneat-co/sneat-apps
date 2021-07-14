import {IJsonGridData, IPipe} from './interfaces';


export function arrayToGrid(o: any[], pipes?: IPipe[]): IJsonGridData {
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
