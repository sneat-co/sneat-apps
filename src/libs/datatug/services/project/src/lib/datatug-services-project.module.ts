import {NgModule} from '@angular/core';
import {ProjectService} from './project.service';
import {ProjectContextService} from './project-context.service';
import {SneatAuthModule} from '@sneat/auth';

@NgModule({
	imports: [
		SneatAuthModule,
	],
	providers: [
		ProjectService,
		ProjectContextService,
	]
})
export class DatatugServicesProjectModule {
}
