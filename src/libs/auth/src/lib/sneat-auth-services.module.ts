import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { RouterModule } from '@angular/router';
import { PrivateTokenStoreService } from './private-token-store.service';
import { SneatAuthGuard } from './sneat-auth-guard';

@NgModule({
	imports: [
		RouterModule,
		AngularFireAuthModule,
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
