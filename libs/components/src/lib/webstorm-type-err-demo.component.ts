import { Component } from '@angular/core';

export interface IIdAndBriefDemo<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

interface Brief {
	readonly title: string;
}

function items<B>(o: Record<string, B>): readonly IIdAndBriefDemo<B>[] {
	return Object.keys(o).map((id) => ({ id, brief: o[id] }));
}

@Component({
	selector: 'sneat-webstorm-type-err-demo',
	template: `
		@for (item of items; track item.id) {
			{{ item.brief.title }}
		}
	`,
})
export class WebstormTypeErrDemoComponent {
	protected readonly _items: Record<string, Brief> = {
		first: { title: 'First' },
	};

	protected get items(): readonly IIdAndBriefDemo<Brief>[] {
		return items(this._items);
	}

	protected readonly idExpr = (i: number, record: { id: string }): string =>
		record.id;
}
