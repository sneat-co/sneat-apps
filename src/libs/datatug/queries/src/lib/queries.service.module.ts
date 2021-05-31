import {NgModule} from '@angular/core';
import {QueriesService} from './queries.service';
import {QUERY_PROJ_ITEM_SERVICE} from './queries.service.token';
import {ProjectItemServiceFactory, ProjItemServiceModule, StoreApiService} from '@sneat/datatug/services/repo';
import {QueryContextSqlService} from "./query-context-sql.service";

@NgModule({
	imports: [
		ProjItemServiceModule,
	],
	providers: [
		{
			provide: QUERY_PROJ_ITEM_SERVICE,
			deps: [
				ProjectItemServiceFactory,
				StoreApiService,
			],
			useFactory: (projectItemServiceFactory: ProjectItemServiceFactory, repoProvider: StoreApiService) =>
				projectItemServiceFactory.newProjectItemService(repoProvider, 'queries', 'query'),
		},
		QueriesService,
		QueryContextSqlService,
	]
})
export class QueriesServiceModule {
}
