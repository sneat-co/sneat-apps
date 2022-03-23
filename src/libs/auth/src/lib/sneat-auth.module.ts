import { NgModule } from "@angular/core";
import { PrivateTokenStoreService } from "./private-token-store.service";
import { SneatAuthGuard } from "./sneat-auth-guard";
import { LoginRequiredComponent } from "./login-required-component/login-required.component";
import { IonicModule } from "@ionic/angular";
import { AuthMenuItemComponent } from "./auth-menu-item/auth-menu-item.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		RouterModule,
	],
	providers: [
		PrivateTokenStoreService,
		SneatAuthGuard,
	],
	declarations: [
		LoginRequiredComponent,
		AuthMenuItemComponent,
	],
	exports: [
		AuthMenuItemComponent,
		LoginRequiredComponent,
	],
})
export class SneatAuthModule {
	constructor() {
		console.log("SneatAuthModule.constructor()");
	}
}
