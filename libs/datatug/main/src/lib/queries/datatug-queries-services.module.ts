import { NgModule } from '@angular/core';
import { DatatugServicesStoreModule } from '../services/repo/datatug-services-store.module';
import { ProjectItemServiceFactory } from '../services/repo/project-item-service';
import { ProjItemServiceModule } from '../services/repo/project-item-service.module';
import { StoreApiService } from '../services/repo/store-api.service';
import { DatatugServicesUnsortedModule } from '../services/unsorted/datatug-services-unsorted.module';
import { QueriesService } from './queries.service';
import { QUERY_PROJ_ITEM_SERVICE } from './queries.service.token';
import { QueryContextSqlService } from './query-context-sql.service';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { QueryEditorStateService } from './query-editor-state-service';
import { QueriesUiService } from './queries-ui.service';

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
