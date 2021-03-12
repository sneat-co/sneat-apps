import {NgModule} from '@angular/core';
import {DatatugNavService} from './datatug-nav.service';
import {DatatugNavContextService} from './datatug-nav-context.service';
import {DatatugServicesProjectModule} from '@sneat/datatug/services/project';

@NgModule({
	imports: [
		DatatugServicesProjectModule,
	],
	providers: [
		DatatugNavService,
		DatatugNavContextService,
	]
})
export class DatatugServicesNavModule {
}
