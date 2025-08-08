import { IProjectSummary } from '../../models/definition/project';
import { IDatatugStoreService } from './datatug-store.service.interface';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class DatatugStoreGithubService implements IDatatugStoreService {
	private readonly http = inject(HttpClient);

	getProjectSummary(projectId: string): Observable<IProjectSummary> {
		console.log('DatatugStoreGithubService.getProjectSummary()', projectId);

		interface urlAndHeaders {
			url: string;
			headers?: Record<string, string>;
		}

		const [repo, org] = projectId.split('@');

		const url = `https://raw.githubusercontent.com/${org}/${repo}/main/datatug/datatug-project.json`;

		console.log('URL:', url);

		const connectTo: Observable<urlAndHeaders> = of({ url });
		// if (storeId.startsWith(GITLAB_REPO_PREFIX)) {
		// 	//url = 'https://gitlab.COMPANY.com/A_Trakhimenok/dsa-datatug/-/raw/master/datatug/datatug-project.json';
		// 	connectTo = this.privateTokenStoreService.getPrivateToken(storeId, projectId).pipe(map(accessToken => (
		// 		{
		// 			url: `https://gitlab.COMPANY.com/api/v4/projects/${projectId}/repository/files/datatug%2Fdatatug-project.json/raw?ref=master`,
		// 			headers: {"PRIVATE-TOKEN": accessToken}
		// 		})));
		// }
		return connectTo.pipe(
			mergeMap((request) =>
				this.http
					.get<IProjectSummary>(request.url, { headers: request.headers })
					.pipe(
						map((p) => {
							if (p.id === projectId) {
								return p;
							}
							if (p.id) {
								console.warn(
									`Request project info with projectId=${projectId} but response JSON have id=${p.id}`,
								);
							}
							return { ...p, id: projectId };
						}),
					),
			),
		);
	}

	watchProjectItem<T>(projectId: string, path?: string): Observable<T | null> {
		return throwError(() => `not implemented ${projectId} ${path}`);
	}
}
