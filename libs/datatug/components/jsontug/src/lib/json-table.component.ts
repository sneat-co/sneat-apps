import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { arrayToGrid, IJsonGridData, IPipe } from '@sneat/datatug-plugins';

@Component({
	selector: 'sneat-datatug-json-table',
	templateUrl: 'json-table.component.html',
	styleUrls: ['json-component.scss'],
})
export class JsonTableComponent implements OnChanges {
	@Input() path = '';
	@Input() json: unknown;
	@Input() level = 0;
	// @Input() path = 'data.#';
	@Input() pipes?: IPipe[];

	public rows?: unknown[][];

	ngOnChanges(changes: SimpleChanges): void {
		if (this.level < 2 && changes['json']) {
			this.rows = (this.json as unknown[][]) || []; /// && [] is a hack to set rows to empty array if json otherwise false
			if (this.rows) {
				const o = this.json as Record<string, unknown>;
				if (!Array.isArray(o)) {
					Object.keys(o).forEach((k) => {
						let key = k;
						let v = o[k];
						if (v && !Array.isArray(v)) {
							const keys = Object.keys(v);
							if (keys.length === 1) {
								const vK = keys[0];
								key += '.' + vK;
								v = (v as Record<string, unknown>)[vK];
							}
						}
						this.rows?.push([key, v]);
					});
				}
			}
		}
	}

	public isSimpleType(o: unknown): boolean {
		return (
			typeof o === 'string' ||
			o instanceof String ||
			(typeof o === 'number' && isFinite(o))
		);
	}

	public isObject(o: unknown): boolean {
		return typeof o === 'object' && o !== null;
	}

	public isEmptyObject(o: unknown): boolean {
		return typeof o === 'object' && o !== null && Object.keys(o).length === 0;
	}

	public grid(o: unknown): IJsonGridData | undefined {
		return o ? arrayToGrid(o as unknown[], this.pipes) : undefined;
	}

	public isArray(o: unknown): boolean {
		return Array.isArray(o);
	}
}
