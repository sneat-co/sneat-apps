import { Component, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-beta-flags',
	templateUrl: './beta-flags.component.html',
	imports: [IonicModule],
})
export class BetaFlagsComponent extends SneatBaseComponent {
	protected readonly $userRecord = signal<IUserRecord | undefined | null>(
		undefined,
	);

	constructor(userService: SneatUserService) {
		super('BetaFlagsComponent');
		userService.userState.pipe(this.takeUntilDestroyed()).subscribe({
			next: (user) => this.$userRecord.set(user.record),
		});
	}
}
