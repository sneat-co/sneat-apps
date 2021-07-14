import {Component, Input} from '@angular/core';

export interface ICellButtonWidgetSettings {
	type: 'button';
	javaScript: string;
	textFormat?: string
	titleFormat?: string
}

@Component({
	selector: 'datatug-cell-href-widget',
	template: '<button [type]="settings.type" [title]="text" (click)="click()">{{text}}</button>'
})
export class CellButtonWidgetComponent {
	@Input() v: unknown;
	@Input() settings?: ICellButtonWidgetSettings;

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

	click(): void {
		if (!this.settings?.javaScript) {
			alert('Button is missing a javascript handler');
			return;
		}
		eval(this.settings?.javaScript);
	}
}


