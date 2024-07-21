import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpaceComponentBaseParams } from './space-component-base-params.service';
import { SpaceBaseComponent } from './space-base-component.directive';
import { SpaceModuleService } from '@sneat/team-services';

export abstract class SpaceModuleBaseComponent<
	Brief,
	Dbo extends Brief,
> extends SpaceBaseComponent {
	protected readonly spaceModuleDbo$ = new BehaviorSubject<
		Dbo | null | undefined
	>(undefined);

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		protected spaceModuleService: SpaceModuleService<Dbo>,
	) {
		super(className, route, teamParams);
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		this.spaceModuleService
			.watchSpaceModuleRecord(this.space.id)
			.pipe(takeUntil(this.spaceIDChanged$))
			.subscribe({
				next: (o) => {
					console.log('teamModuleDto loaded', o.dbo);
					this.spaceModuleDbo$.next(o.dbo);
					this.onSpaceModuleDtoChanged(o.dbo || null);
				},
				error: (err) => {
					console.error('Failed to load team module record', err);
				},
			});
	}

	protected onSpaceModuleDtoChanged(dto: Dbo | null) {
		console.log(`${this.className}.onSpaceModuleDtoChanged()`, dto);
	}
}
