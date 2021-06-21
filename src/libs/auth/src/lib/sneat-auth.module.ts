import {NgModule} from '@angular/core';
import {PrivateTokenStoreService} from "./private-token-store.service";
import {SneatAuthGuard} from "./sneat-auth-guard";

@NgModule({
	providers: [
		PrivateTokenStoreService,
		SneatAuthGuard,
	],
})
export class SneatAuthModule {
	constructor() {
		console.log('SneatAuthModule');
	}
}
