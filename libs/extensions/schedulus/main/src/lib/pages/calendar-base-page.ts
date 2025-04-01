import { SpaceBaseComponent } from '@sneat/space-components';

export abstract class CalendarBasePage extends SpaceBaseComponent {
	protected constructor(className: string) {
		super(className);
		this.$defaultBackUrlSpacePath.set('calendar');
	}
}
