import { SpaceBaseComponent } from '@sneat/space-components';

export abstract class CalendarBasePage extends SpaceBaseComponent {
	public override get defaultBackUrl(): string {
		const space = this.$space();
		return space ? `/space/${space.type}/${space.id}/calendar` : '';
	}
}
