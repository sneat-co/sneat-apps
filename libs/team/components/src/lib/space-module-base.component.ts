import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
		protected spaceModuleService: SpaceModuleService<Dbo>,
	) {
		super(className);
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		this.spaceModuleService
			.watchSpaceModuleRecord(this.space.id)
			.pipe(takeUntil(this.spaceIDChanged$))
			.subscribe({
				next: (o) => {
					console.log('spaceModuleDto loaded', o.dbo);
					this.spaceModuleDbo$.next(o.dbo);
					this.onSpaceModuleDboChanged(o.dbo || null);
				},
				error: (err) => {
					console.error('Failed to load team module record', err);
				},
			});
	}

	protected onSpaceModuleDboChanged(dbo: Dbo | null) {
		console.log(`${this.className}.onSpaceModuleDtoChanged()`, dbo);
	}
}
