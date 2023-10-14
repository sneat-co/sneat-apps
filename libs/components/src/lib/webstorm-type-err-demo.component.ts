import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

export interface IBriefAndIdDemo<Brief> {
	readonly id: string;
	readonly brief: Brief;
}

interface Brief {
	readonly title: string;
}

function items<B>(o: { [id: string]: B }): readonly IBriefAndIdDemo<B>[] {
	return Object.keys(o).map((id) => ({ id, brief: o[id] }));
}

@Component({
	standalone: true,
	selector: 'sneat-webstorm-type-err-demo',
	template: ` <ng-container *ngFor="let item of items; trackBy: idFunc">
		{{ item.brief.title }}
	</ng-container>`,
	imports: [CommonModule],
})
export class WebstormTypeErrDemoComponent {
	protected readonly _items: { [id: string]: Brief } = {
		first: { title: 'First' },
	};

	protected get items(): readonly IBriefAndIdDemo<Brief>[] {
		return items(this._items);
	}

	protected idFunc(i: number, record: { id: string }): string {
		return record.id;
	}

	protected readonly idExpr = (i: number, record: { id: string }): string =>
		record.id;
}
