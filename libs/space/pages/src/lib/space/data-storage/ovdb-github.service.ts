import { Injectable, inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { SneatApiService } from '@sneat/api';
import { Observable } from 'rxjs';

// Thin client for the sneat-go OVDB GitHub grant endpoints (Firebase-ID-token
// auth, space-admin-only on the backend):
//   GET  v0/ovdb/github_grant?spaceID=...     -> { grant | null }
//   POST v0/ovdb/set_github_grant             -> { grant }
//   POST v0/ovdb/revoke_github_grant          -> { grant }
// The `v0/` prefix is baked into SneatApiService's base URL, so endpoint
// strings here are relative (mirrors DiscoverMoviesService).
//
// A grant binds one space to one GitHub repo (owner/name) on one branch through
// a GitHub App installation. See
// backstage/docs/roadmaps/ovdb-access-tokens-grants.md (Decision 2).

export type OvdbGithubGrantStatus = 'active' | 'revoked' | 'broken';

export interface IOvdbGithubGrant {
  readonly installationID: number;
  readonly repo: string; // "owner/name"
  readonly branch: string;
  readonly status: OvdbGithubGrantStatus;
  readonly createdBy?: string;
  readonly createdAt?: string;
  readonly lastVerifiedAt?: string;
  readonly lastFailure?: string;
}

export interface IOvdbGithubGrantResponse {
  readonly grant: IOvdbGithubGrant | null;
}

export interface ISetGithubGrantRequest {
  readonly spaceID: string;
  readonly installationID: number;
  readonly repo: string; // "owner/name"
  readonly branch?: string; // defaults to "main" on the backend
}

export interface IRevokeGithubGrantRequest {
  readonly spaceID: string;
}

@Injectable()
export class OvdbGithubService {
  private readonly sneatApiService = inject(SneatApiService);

  public getGithubGrant(spaceID: string): Observable<IOvdbGithubGrantResponse> {
    const params = new HttpParams().set('spaceID', spaceID);
    return this.sneatApiService.get('ovdb/github_grant', params);
  }

  public setGithubGrant(
    request: ISetGithubGrantRequest,
  ): Observable<IOvdbGithubGrantResponse> {
    return this.sneatApiService.post('ovdb/set_github_grant', request);
  }

  public revokeGithubGrant(
    request: IRevokeGithubGrantRequest,
  ): Observable<IOvdbGithubGrantResponse> {
    return this.sneatApiService.post('ovdb/revoke_github_grant', request);
  }
}
