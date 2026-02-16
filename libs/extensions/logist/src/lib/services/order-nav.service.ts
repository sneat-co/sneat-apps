import { Injectable, NgModule, inject } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { ILogistOrderContext } from '../dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';

@Injectable()
export class OrderNavService {
  private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
  private readonly navController = inject(NavController);

  goOrderPage(
    direction: 'forward' | 'back',
    order: ILogistOrderContext,
    url?: { path: string; fragment?: string },
    params?: Record<string, unknown>,
    state?: Record<string, unknown>,
  ): Promise<boolean> {
    const { id, space } = order;
    let u = `/space/${space.type}/${space.id}/order/${id}`;
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
