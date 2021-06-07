import {NgModule} from '@angular/core';
import {SneatUserService} from './sneat-user.service';
import {SneatApiModule} from '@sneat/api';
import {PrivateTokenStoreService} from "./private-token-store.service";
import {SneatAuthStateService} from "./sneat-auth-state-service";

@NgModule({
	imports: [
		SneatApiModule,
	],
	providers: [
		SneatUserService,
		PrivateTokenStoreService,
		SneatAuthStateService,
	]
})
export class SneatAuthModule {
	constructor() {
		console.log('SneatAuthModule');
	}
}
