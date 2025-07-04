import { computed, Directive, effect, inject, input } from '@angular/core';
import { ISpaceContext } from '@sneat/space-models';
import { SneatBaseComponent } from '@sneat/ui';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { SpaceNavService } from '../services/space-nav.service';

@Directive()
export abstract class WithSpaceInput extends SneatBaseComponent {
	protected readonly spaceNavService = inject(SpaceNavService);

	public readonly $space = input.required<ISpaceContext>();

	protected readonly $spaceID = computed(() => this.$space().id);
	private readonly spaceIDChanged = new BehaviorSubject<string | undefined>(
		undefined,
	);
	protected spaceID$ = this.spaceIDChanged
		.asObservable()
		.pipe(this.takeUntilDestroyed(), distinctUntilChanged());

	protected readonly $spaceType = computed(() => this.$space().type);
	protected readonly $spaceRef = computed(() => ({
		id: this.$spaceID(),
		type: this.$spaceType(),
	}));

	constructor() {
		super();
		effect(() => {
			const spaceID = this.$spaceID();
			if (spaceID !== this.spaceIDChanged.value) {
				this.onSpaceIdChanged(spaceID);
			}
		});
	}

	protected onSpaceIdChanged(spaceID: string): void {
		this.spaceIDChanged.next(spaceID);
	}
}
