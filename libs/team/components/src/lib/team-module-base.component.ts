import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpaceComponentBaseParams } from './space-component-base-params.service';
import { SpaceBaseComponent } from './space-base-component.directive';
import { TeamModuleService } from '@sneat/team-services';

export abstract class TeamModuleBaseComponent<
	Brief,
	Dbo extends Brief,
> extends SpaceBaseComponent {
	protected readonly teamModuleDto$ = new BehaviorSubject<
		Dbo | null | undefined
	>(undefined);

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		protected teamModuleService: TeamModuleService<Dbo>,
	) {
		super(className, route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		this.teamModuleService
			.watchSpaceModuleRecord(this.team.id)
			.pipe(takeUntil(this.teamIDChanged$))
			.subscribe({
				next: (o) => {
					console.log('teamModuleDto loaded', o.dbo);
					this.teamModuleDto$.next(o.dbo);
					this.onTeamModuleDtoChanged(o.dbo || null);
				},
				error: (err) => {
					console.error('Failed to load team module record', err);
				},
			});
	}
	protected onTeamModuleDtoChanged(dto: Dbo | null) {
		console.log(`${this.className}.onTeamModuleDtoChanged()`, dto);
	}
}
