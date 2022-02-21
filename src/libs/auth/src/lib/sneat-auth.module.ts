import { NgModule } from "@angular/core";
import { PrivateTokenStoreService } from "./private-token-store.service";
import { SneatAuthGuard } from "./sneat-auth-guard";
import { LoginRequiredComponentComponent } from "./login-required-component/login-required-component.component";
import { IonicModule } from "@ionic/angular";
import { AuthMenuItemComponent } from "./auth-menu-item/auth-menu-item.component";

@NgModule({
	imports: [
		IonicModule,
	],
	providers: [
		PrivateTokenStoreService,
		SneatAuthGuard,
	],
	declarations: [
		LoginRequiredComponentComponent,
		AuthMenuItemComponent,
	],
	exports: [
		AuthMenuItemComponent,
	],
})
export class SneatAuthModule {
	constructor() {
		console.log("SneatAuthModule.constructor()");
	}
}
