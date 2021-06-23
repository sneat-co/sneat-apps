import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SneatAuthModule} from "@sneat/auth";

@NgModule({
	imports: [
		CommonModule,
		SneatAuthModule,
	],
	providers: [
		// DatatugUserService,
	]
})
export class DatatugServicesBaseModule {
}
