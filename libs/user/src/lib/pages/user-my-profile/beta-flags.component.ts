import { Component, signal, inject } from '@angular/core';
import {
	IonCard,
	IonCheckbox,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-beta-flags',
	templateUrl: './beta-flags.component.html',
	imports: [
		IonCard,
		IonItemGroup,
		IonItemDivider,
		IonCheckbox,
		IonLabel,
		IonItem,
	],
})
export class BetaFlagsComponent extends SneatBaseComponent {
	protected readonly $userRecord = signal<IUserRecord | undefined | null>(
		undefined,
	);

	constructor() {
		const userService = inject(SneatUserService);

		super('BetaFlagsComponent');
		userService.userState.pipe(this.takeUntilDestroyed()).subscribe({
			next: (user) => this.$userRecord.set(user.record),
		});
	}
}
