import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProjectItemRef } from '../../core/project-context';
import { IFolder } from '../../models/definition/folder';
import { DatatugStoreServiceFactory } from '../../services/repo/datatug-store-service-factory.service';

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
