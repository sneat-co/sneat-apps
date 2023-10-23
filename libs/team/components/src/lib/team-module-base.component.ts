import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamComponentBaseParams } from './team-component-base-params';
import { TeamBaseComponent } from './team-base.component';
import { TeamModuleService } from '@sneat/team-services';

export class TeamModuleBaseComponent<
	Brief,
	Dto extends Brief,
> extends TeamBaseComponent {
	protected readonly teamModuleDto$ = new BehaviorSubject<
		Dto | null | undefined
	>(undefined);

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		protected teamModuleService: TeamModuleService<Dto>,
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
