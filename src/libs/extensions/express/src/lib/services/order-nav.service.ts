import { Inject, Injectable, NgModule } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IExpressOrderContext } from '../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';


@Injectable()
export class OrderNavService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
	) {
	}

	goOrderPage(order: IExpressOrderContext, url: { path: string, fragment?: string }, params?: { [id: string]: unknown }, state?: { [id: string]: unknown }): Promise<boolean> {
		const { id, team } = order;
		let u = `/space/${team.type}/${team.id}/order/${id}`;
		if (url.path) {
			u += '/' + url.path;
		}
		if (params) {
			u += '?';
			Object.entries(params).forEach(([k, v]) => {
				u += `${k}=${encodeURIComponent('' + v)}`;
			});
		}
		if (url.fragment) {
			u += '#' + url.fragment;
		}
		console.log('OrderNavService.goOrderPage()', u);
		return this.navController.navigateForward(u, { state });
	}
}

@NgModule({
	imports: [],
	providers: [
		OrderNavService,
	],
})
export class OrderNavServiceModule {
}
