import {NgModule} from '@angular/core';
import {DatatugNavService} from './datatug-nav.service';
import {DatatugNavContextService} from './datatug-nav-context.service';
import {DatatugServicesProjectModule} from '@sneat/datatug/services/project';
import {DatatugMenuService} from "./datatug-menu.service";

@NgModule({
	imports: [
		DatatugServicesProjectModule,
	],
	providers: [
		DatatugNavService,
		DatatugNavContextService,
		DatatugMenuService,
	]
})
export class DatatugServicesNavModule {
}
