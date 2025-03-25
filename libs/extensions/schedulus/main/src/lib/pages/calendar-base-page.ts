import { SpaceBaseComponent } from '@sneat/space-components';

export class CalendarBasePage extends SpaceBaseComponent {
	public override get defaultBackUrl(): string {
		const t = this.space;
		return t ? `/space/${t.type}/${t.id}/calendar` : '';
	}

	constructor(className: string) {
		super(className);
	}
}
