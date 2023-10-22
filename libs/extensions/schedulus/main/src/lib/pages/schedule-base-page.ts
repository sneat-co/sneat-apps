import { ActivatedRoute } from '@angular/router';
import {
	TeamPageBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team/components';

export class ScheduleBasePage extends TeamPageBaseComponent {
	public override get defaultBackUrl(): string {
		const t = this.team;
		return t ? `/space/${t.type}/${t.id}/schedule` : '';
	}

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super(className, route, teamParams);
	}
}
