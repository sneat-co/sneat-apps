import { NgModule } from '@angular/core';
import { QueriesService } from './queries.service';
import { QUERY_PROJ_ITEM_SERVICE } from './queries.service.token';
import {
	DatatugServicesStoreModule,
	ProjectItemServiceFactory,
	ProjItemServiceModule,
	StoreApiService,
} from '@sneat/datatug/services/repo';
import { QueryContextSqlService } from './query-context-sql.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IonicModule } from '@ionic/angular';
import { QueryEditorStateService } from './query-editor-state-service';
import { QueriesUiService } from './queries-ui.service';
import { DatatugServicesUnsortedModule } from '@sneat/datatug/services/unsorted';

@NgModule({
	imports: [
		DatatugServicesStoreModule,
		ProjItemServiceModule,
		IonicModule,
		DatatugServicesUnsortedModule,
	],
	providers: [
		{
			provide: QUERY_PROJ_ITEM_SERVICE,
			deps: [AngularFirestore, ProjectItemServiceFactory, StoreApiService],
			useFactory: (
				db: AngularFirestore,
				projectItemServiceFactory: ProjectItemServiceFactory,
				repoProvider: StoreApiService
			) =>
				projectItemServiceFactory.newProjectItemService(
					db,
					repoProvider,
					'queries',
					'query'
				),
		},
		QueriesService,
		QueryContextSqlService,
		QueryEditorStateService,
		QueriesUiService,
	],
})
export class DatatugQueriesServicesModule {}
