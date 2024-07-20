import { ActivatedRoute } from '@angular/router';
import { SpaceBaseComponent } from './space-base-component.directive';
import { SpaceComponentBaseParams } from './space-component-base-params.service';

export abstract class TeamItemsBaseComponent extends SpaceBaseComponent {
	protected constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
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
