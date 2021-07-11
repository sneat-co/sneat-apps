import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {arrayToGrid, IJsonGridData} from './array-to-grid';

@Component({
	selector: 'datatug-json-table',
	templateUrl: 'json-table.component.html',
	styleUrls: ['json-component.scss'],
})
export class JsonTableComponent implements OnChanges {
	@Input() json: any;
	@Input() level = 0;

	public rows?: any[];

	ngOnChanges(changes: SimpleChanges): void {
		if (this.level < 2 && changes.json) {
			this.rows = this.json && [];
			if (this.rows) {
				const o = this.json;
				if (!Array.isArray(o)) {
					Object.keys(o).forEach(k => {
						let key = k;
						let v = o[k];
						if (v && !Array.isArray(v)) {
							const keys = Object.keys(v);
							if (keys.length === 1) {
								const vK = keys[0]
								key += '.' + vK;
								v = v[vK];
							}
						}
						this.rows?.push([key, v]);
					});
				}
			}
		}
	}

	public isSimpleType(o: any): boolean {
		return (typeof o === 'string' || o instanceof String)
			|| (typeof o === 'number' && isFinite(o));
	}

	public isObject(o: any): boolean {
		return typeof o === 'object' && o !== null
	}

	public isEmptyObject(o: any): boolean {
		return typeof o === 'object' && o !== null && Object.keys(o).length === 0;
	}

	public grid(o: any): IJsonGridData {
		return arrayToGrid(o);
	}

	public isArray(o: any): boolean {
		return Array.isArray(o);
	}
}
