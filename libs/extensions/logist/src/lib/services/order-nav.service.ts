import { Inject, Injectable, NgModule } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ILogistOrderContext } from '../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';

@Injectable()
export class OrderNavService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
	) {}

	goOrderPage(
		direction: 'forward' | 'back',
		order: ILogistOrderContext,
		url?: { path: string; fragment?: string },
		params?: Record<string, unknown>,
		state?: Record<string, unknown>,
	): Promise<boolean> {
		const { id, team } = order;
		let u = `/space/${team.type}/${team.id}/order/${id}`;
		if (url?.path) {
			u += '/' + url.path;
		}
		if (params) {
			u += '?';
			Object.entries(params).forEach(([k, v]) => {
				u += `${k}=${encodeURIComponent('' + v)}`;
			});
		}
		if (url?.fragment) {
			u += '#' + url.fragment;
		}
		console.log('OrderNavService.goOrderPage()', u);
		switch (direction) {
			case 'forward':
				return this.navController.navigateForward(u, { state });
			case 'back':
				return this.navController.navigateBack(u, { state });
			default:
				throw new Error(`invalid direction: ${direction}`);
		}
	}
}

@NgModule({
	imports: [],
	providers: [OrderNavService],
})
export class OrderNavServiceModule {}
