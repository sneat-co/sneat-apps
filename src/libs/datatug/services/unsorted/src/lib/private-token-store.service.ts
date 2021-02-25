import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';

const tokenKey = (domain: string, projectId: string): string => {
  return `private_token/${domain}/${projectId}`;
}

@Injectable()
export class PrivateTokenStoreService {
  constructor() {
  }


  public getPrivateToken(domain: string, projectId: string): Observable<string> {
    const key = tokenKey(domain, projectId);
    let token = localStorage.getItem(key);
    if (token) {
      return of(token)
    }

    const subj = new Subject<string>();
    setTimeout(() => {
      token = prompt('Please provide GitLab access token:');
      if (token) {
        localStorage.setItem(key, token);
        subj.next(token);
      } else {
        subj.error('token have not been provided by user');
      }
    }, 1);
    return subj;
  }
}
