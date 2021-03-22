import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatatugUserService} from "./datatug-user-service";

@NgModule({
	imports: [CommonModule],
	providers: [
		DatatugUserService,
	]
})
export class DatatugServicesBaseModule {
}
