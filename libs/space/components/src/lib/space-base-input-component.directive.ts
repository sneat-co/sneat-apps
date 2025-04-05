import { computed, Directive, input } from '@angular/core';
import { ISpaceContext } from '@sneat/space-models';

@Directive()
export abstract class WithSpaceInput {
	public readonly $space = input.required<ISpaceContext>();
	protected readonly $spaceID = computed(() => this.$space().id);
}
