import {NgModule} from '@angular/core';
import {SneatUserService} from './sneat-user.service';
import {SneatApiModule} from '@sneat/api';
import {PrivateTokenStoreService} from "./private-token-store.service";
import {SneatAuthStateService} from "./sneat-auth-state-service";
import {SneatAuthGuard} from "./sneat-auth-guard";

@NgModule({
	imports: [
		SneatApiModule,
	],
	providers: [
		SneatUserService,
		PrivateTokenStoreService,
		SneatAuthStateService,
		SneatAuthGuard,
	]
})
export class SneatAuthModule {
	constructor() {
		console.log('SneatAuthModule');
	}
}
