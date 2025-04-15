import { computed, signal, Signal } from '@angular/core';
import { SneatUserService } from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { filter, map, Observable, takeUntil } from 'rxjs';

export class UserSpaceBriefProvider {
	// `null` indicates the user's record has been loaded but has no spaces
	private readonly $userSpaceBriefs = signal<
		Readonly<Record<string, IUserSpaceBrief>> | undefined
	>(undefined);

	constructor(
		private readonly destroyed$: Observable<void>,
		private readonly $spaceID: Signal<string>,
		userService: SneatUserService,
	) {
		userService.userState
			.pipe(
				takeUntil(this.destroyed$),
				filter((user) => !!user.record),
				map((user) => user.record?.spaces || {}),
			)
			.subscribe(this.$userSpaceBriefs.set);
	}

	// `null` indicates the user's record has been loaded but has no space
	public readonly $userSpaceBrief = computed(() => {
		const spaceID = this.$spaceID();
		const userSpaceBriefs = this.$userSpaceBriefs();
		if (!spaceID || !userSpaceBriefs) {
			return undefined;
		}
		return userSpaceBriefs[spaceID] || null;
	});

	// `null` indicates the user's record has been loaded but has no respective value
	public readonly $userContactID = computed<string | null | undefined>(() => {
		const userSpace = this.$userSpaceBrief();
		return userSpace == undefined
			? undefined
			: userSpace?.userContactID || null;
	});
}
