import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonTitle } from '@ionic/angular/standalone';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	imports: [TitleCasePipe, IonTitle],
	changeDetection: ChangeDetectionStrategy.OnPush,
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
