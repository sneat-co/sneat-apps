import {NgModule} from '@angular/core';
import {ProjectItemServiceFactory} from '../../../services/repo/src/lib/project-item-service';
import {QueriesService} from './queries.service';
import {QUERY_PROJ_ITEM_SERVICE} from './queries.service.token';
import {StoreApiService} from '@sneat/datatug/services/repo';
import {ProjItemServiceModule} from '../../../services/repo/src/lib/project-item-service.module';
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
