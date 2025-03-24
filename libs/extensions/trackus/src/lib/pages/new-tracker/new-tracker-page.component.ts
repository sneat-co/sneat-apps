import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SpaceBaseComponent } from '@sneat/team-components';
import { NewTrackerFormComponent } from '../../components/new-tracker/new-tracker-form.component';

@Component({
	selector: 'sneat-new-tracker',
	templateUrl: './new-tracker-page.component.html',
	imports: [IonicModule, NewTrackerFormComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewTrackerPageComponent extends SpaceBaseComponent {
	protected readonly $category = signal<string>('');

	constructor() {
		super('NewTrackerPage');
		this.route.queryParamMap.subscribe((paramMap) => {
			const category = paramMap.get('category');
			if (category) {
				this.$category.set(category);
			}
		});
	}
}
