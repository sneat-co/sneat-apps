import { computed, Directive, inject, input } from '@angular/core';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { SneatBaseComponent } from '@sneat/ui';

@Directive()
export abstract class WithSpaceInput extends SneatBaseComponent {
	public readonly $space = input.required<ISpaceContext>();
	protected readonly $spaceID = computed(() => this.$space().id);
	protected readonly $spaceType = computed(() => this.$space().type);
	protected readonly $spaceRef = computed(() => {
		const id = this.$spaceID();
		const type = this.$spaceType();
		return { id, type };
	});

	protected readonly spaceNavService = inject(SpaceNavService);
}
