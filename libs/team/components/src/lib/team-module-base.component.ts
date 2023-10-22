import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamComponentBaseParams } from './team-component-base-params';
import { TeamPageBaseComponent } from './team-page-base-component.service';
import { TeamModuleService } from '@sneat/team/services';

export class TeamModuleBaseComponent<
	Brief,
	Dto extends Brief,
> extends TeamPageBaseComponent {
	protected readonly teamModuleDto$ = new BehaviorSubject<
		Dto | null | undefined
	>(undefined);

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		protected readonly teamModuleService: TeamModuleService<Dto>,
	) {
		super(className, route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		this.teamModuleService
			.watchTeamModuleRecord(this.team)
			.pipe(takeUntil(this.teamIDChanged$))
			.subscribe({
				next: (o) => {
					console.log('teamModuleDto loaded', o.dto);
					this.teamModuleDto$.next(o.dto);
					this.onTeamModuleDtoChanged(o.dto || null);
				},
				error: (err) => {
					console.error('Failed to load team module record', err);
				},
			});
	}

	protected onTeamModuleDtoChanged(dto: Dto | null) {
		console.log(`${this.className}.onTeamModuleDtoChanged()`, dto);
	}
}
