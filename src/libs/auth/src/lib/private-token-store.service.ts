import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

const tokenKey = (domain: string, projectId: string) => `private/tokens/${domain}/${projectId}`;

export const canceledByUser = 'canceled by user';

@Injectable()
export class PrivateTokenStoreService {
	public getPrivateToken(
		domain: string,
		projectId: string,
	): Observable<string> {
		// Consider storing all tokens in a single item
		const key = tokenKey(domain, projectId);
		let token = localStorage.getItem(key);
		if (token) {
			return of(token);
		}

		const subj = new Subject<string>();
		setTimeout(() => {
			token = prompt(`Please provide access token for ${domain}:`);
			if (token) {
				localStorage.setItem(key, token);
				subj.next(token);
			} else {
				subj.error(canceledByUser);
			}
		}, 1);
		return subj.asObservable();
	}
}
