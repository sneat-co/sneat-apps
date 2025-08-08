import { IJsonGridData, IPipe } from './interfaces';

export function arrayToGrid(o: unknown[], pipes?: IPipe[]): IJsonGridData {
	const data: IJsonGridData = {
		cols: [],
		rows: [],
	};
	o.forEach((item) => {
		if (pipes?.length) {
			pipes.forEach((pipe) => {
				item = pipe.tunnel(item);
			});
		}
		const keys = Object.keys(item as object);
		keys.forEach((key) => {
			if (!data.cols.includes(key)) {
				data.cols.push(key);
			}
		});
		const row = new Array(data.cols.length);
		keys.forEach((key) => {
			const v = (item as Record<string, unknown>)[key];
			if (v) {
				row[data.cols.indexOf(key)] = v;
			}
		});
		data.rows.push(row);
	});
	return data;
}
