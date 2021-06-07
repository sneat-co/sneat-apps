import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatatugUserService} from "./datatug-user-service";
import {SneatAuthModule} from "@sneat/auth";

@NgModule({
	imports: [
		CommonModule,
		SneatAuthModule,
	],
	providers: [
		DatatugUserService,
	]
})
export class DatatugServicesBaseModule {
}
