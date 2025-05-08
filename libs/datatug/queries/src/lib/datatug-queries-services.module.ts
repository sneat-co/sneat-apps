import { NgModule } from '@angular/core';
import { QueriesService } from './queries.service';
import { QUERY_PROJ_ITEM_SERVICE } from './queries.service.token';
import {
	DatatugServicesStoreModule,
	ProjectItemServiceFactory,
	ProjItemServiceModule,
	StoreApiService,
} from '@sneat/ext-datatug-services-repo';
import { QueryContextSqlService } from './query-context-sql.service';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { QueryEditorStateService } from './query-editor-state-service';
import { QueriesUiService } from './queries-ui.service';
import { DatatugServicesUnsortedModule } from '@sneat/ext-datatug-services-unsorted';

@NgModule({
	imports: [
		DatatugServicesStoreModule,
		ProjItemServiceModule,
		DatatugServicesUnsortedModule,
	],
	providers: [
		{
			provide: QUERY_PROJ_ITEM_SERVICE,
			deps: [AngularFirestore, ProjectItemServiceFactory, StoreApiService],
			useFactory: (
				db: AngularFirestore,
				projectItemServiceFactory: ProjectItemServiceFactory,
				repoProvider: StoreApiService,
			) =>
				projectItemServiceFactory.newProjectItemService(
					db,
					repoProvider,
					'queries',
					'query',
				),
		},
		QueriesService,
		QueryContextSqlService,
		QueryEditorStateService,
		QueriesUiService,
	],
})
export class DatatugQueriesServicesModule {}
