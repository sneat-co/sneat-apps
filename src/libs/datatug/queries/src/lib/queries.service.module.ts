import {NgModule} from '@angular/core';
import {QueriesService} from './queries.service';
import {QUERY_PROJ_ITEM_SERVICE} from './queries.service.token';
import {
	DatatugServicesStoreModule,
	ProjectItemServiceFactory,
	ProjItemServiceModule,
	StoreApiService
} from '@sneat/datatug/services/repo';
import {QueryContextSqlService} from "./query-context-sql.service";
import {HttpClientModule} from '@angular/common/http';
import {AngularFirestore} from '@angular/fire/firestore';

@NgModule({
	imports: [
		DatatugServicesStoreModule,
		ProjItemServiceModule,
	],
	providers: [
		{
			provide: QUERY_PROJ_ITEM_SERVICE,
			deps: [
				AngularFirestore,
				ProjectItemServiceFactory,
				StoreApiService,
			],
			useFactory: (
				db: AngularFirestore,
				projectItemServiceFactory: ProjectItemServiceFactory,
				repoProvider: StoreApiService,
			) => projectItemServiceFactory.newProjectItemService(db, repoProvider, 'queries', 'query'),
		},
		QueriesService,
		QueryContextSqlService,
	]
})
export class QueriesServiceModule {
}
