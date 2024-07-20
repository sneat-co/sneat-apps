import { ActivatedRoute } from '@angular/router';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';

export class CalendarBasePage extends SpaceBaseComponent {
	public override get defaultBackUrl(): string {
		const t = this.team;
		return t ? `/space/${t.type}/${t.id}/calendar` : '';
	}

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
	) {
		super(className, route, teamParams);
	}
}
