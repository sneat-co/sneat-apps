import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IFolder } from '@sneat/ext-datatug-models';
import { DatatugStoreServiceFactory } from '@sneat/ext-datatug-services-repo';
import { IProjectItemRef } from '@sneat/ext-datatug-core';

@Injectable()
export class DatatugFoldersService {
	private readonly storeServiceFactory = inject(DatatugStoreServiceFactory);

	watchFolder(ref: IProjectItemRef): Observable<IFolder | null | undefined> {
		const storeService = this.storeServiceFactory.getDatatugStoreService(
			ref.storeId,
		);
		return storeService.watchProjectItem<IFolder>(
			ref.projectId,
			`/folders/${ref.id}`,
		);
	}
}
