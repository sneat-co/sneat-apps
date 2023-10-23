import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IFolder } from '@sneat/datatug-models';
import { DatatugStoreServiceFactory } from '@sneat/datatug-services-repo';
import { IProjectItemRef } from '@sneat/datatug-core';

@Injectable({
	providedIn: 'root',
})
export class DatatugFoldersService {
	constructor(
		private readonly storeServiceFactory: DatatugStoreServiceFactory,
	) {}

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
