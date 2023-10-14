import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent } from './team-base.component';
import { TeamComponentBaseParams } from './team-component-base-params';

export abstract class TeamItemsBaseComponent extends TeamBaseComponent {
	protected constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private parentPagePath: string,
	) {
		super(className, route, teamParams);
	}

	override get defaultBackUrl(): string {
		const url = super.defaultBackUrl;
		return this.parentPagePath && this.team?.id && url.endsWith(this.team?.id)
			? url + '/' + this.parentPagePath
			: url;
	}
}
