import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-space-page-title',
	templateUrl: './space-page-title.component.html',
})
export class SpacePageTitleComponent {
	@Input() icon?: string;
	@Input() generalTitle?: string;
	@Input({ required: true }) space?: ISpaceContext;
	@Input() titlesBySpaceType?: Record<string, string>;

	public get typeTitle(): string {
		return this.space?.type && this.titlesBySpaceType
			? this.titlesBySpaceType[this.space.type]
			: '';
	}
}
