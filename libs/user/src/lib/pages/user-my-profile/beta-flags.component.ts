import { Component, Inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatUserService } from '@sneat/auth-core';
import { IUserRecord } from '@sneat/auth-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
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

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		userService: SneatUserService,
	) {
		super('BetaFlagsComponent', errorLogger);
		userService.userState.pipe(this.takeUntilDestroyed()).subscribe({
			next: (user) => this.$userRecord.set(user.record),
		});
	}
}
