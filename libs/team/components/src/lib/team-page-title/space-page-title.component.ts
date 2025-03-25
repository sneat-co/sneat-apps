import { TitleCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-space-page-title',
	templateUrl: './space-page-title.component.html',
	imports: [
		IonicModule, // TODO(help-wanted): For some reason this fails: import { ... } from '@ionic/angular/standalone';
		TitleCasePipe,
	],
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
