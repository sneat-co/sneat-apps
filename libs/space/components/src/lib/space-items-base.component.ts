import { signal } from '@angular/core';
import { SpaceBaseComponent } from './space-base-component.directive';

export abstract class SpaceItemsBaseComponent extends SpaceBaseComponent {
	protected constructor(
		className: string,
		private parentPagePath: string,
	) {
		super(className);
	}

	protected readonly $filter = signal<string>('');

	override get defaultBackUrl(): string {
		const url = super.defaultBackUrl;
		return this.parentPagePath && this.space?.id && url.endsWith(this.space?.id)
			? url + '/' + this.parentPagePath
			: url;
	}
}
