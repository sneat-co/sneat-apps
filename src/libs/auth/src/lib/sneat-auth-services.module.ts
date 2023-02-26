import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PrivateTokenStoreService } from './private-token-store.service';
import { SneatAuthGuard } from './sneat-auth-guard';

@NgModule({
	imports: [
		RouterModule,
	],
	providers: [
		PrivateTokenStoreService,
		SneatAuthGuard,
	],
})
export class SneatAuthServicesModule {
	constructor() {
		console.log('SneatAuthServicesModule.constructor()');
	}
}
