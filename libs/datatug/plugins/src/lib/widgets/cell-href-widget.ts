import { Component, Input } from '@angular/core';

export interface ICellHrefWidgetSettings {
	textFormat?: string;
	titleFormat?: string;
	hrefFormat?: string;
}

@Component({
	selector: 'datatug-cell-href-widget',
	template: '<a [href]="href" [title]="text">{{text}}</a>',
})
export class CellHrefWidgetComponent {
	@Input() v: unknown;
	@Input() settings?: ICellHrefWidgetSettings;

	public get href(): string {
		const h = this.settings?.hrefFormat as string;
		const v = this.v as string;
		return h ? h.replace('{value}', v) : v;
	}

	public get text(): string {
		const t = this.settings?.textFormat as string;
		const v = this.v as string;
		return t ? t.replace('{value}', v) : v;
	}

	public get title(): string {
		const t = this.settings?.titleFormat as string;
		const v = this.v as string;
		return t ? t.replace('{value}', v) : v;
	}
}
