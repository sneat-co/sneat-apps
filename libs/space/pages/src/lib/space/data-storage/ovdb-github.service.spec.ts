import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';

import {
  IOvdbGithubGrantResponse,
  OvdbGithubService,
} from './ovdb-github.service';

describe('OvdbGithubService', () => {
  const response: IOvdbGithubGrantResponse = {
    grant: {
      installationID: 12345,
      repo: 'octocat/family-data',
      branch: 'main',
      status: 'active',
    },
  };

  let get: ReturnType<typeof vi.fn>;
  let post: ReturnType<typeof vi.fn>;
  let service: OvdbGithubService;

  beforeEach(() => {
    get = vi.fn(() => of(response));
    post = vi.fn(() => of(response));
    TestBed.configureTestingModule({
      providers: [
        OvdbGithubService,
        { provide: SneatApiService, useValue: { get, post } },
      ],
    });
    service = TestBed.inject(OvdbGithubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('GETs the grant from ovdb/github_grant with a spaceID param', () => {
    let result: IOvdbGithubGrantResponse | undefined;
    service.getGithubGrant('space1').subscribe((r) => (result = r));
    expect(get).toHaveBeenCalledTimes(1);
    const [endpoint, params] = get.mock.calls[0];
    expect(endpoint).toBe('ovdb/github_grant');
    expect(params).toBeInstanceOf(HttpParams);
    expect((params as HttpParams).get('spaceID')).toBe('space1');
    expect(result).toEqual(response);
  });

  it('POSTs a new grant to ovdb/set_github_grant with the full payload', () => {
    const request = {
      spaceID: 'space1',
      installationID: 12345,
      repo: 'octocat/family-data',
      branch: 'main',
    };
    let result: IOvdbGithubGrantResponse | undefined;
    service.setGithubGrant(request).subscribe((r) => (result = r));
    expect(post).toHaveBeenCalledWith('ovdb/set_github_grant', request);
    expect(result).toEqual(response);
  });

  it('POSTs to ovdb/revoke_github_grant with just the spaceID', () => {
    service.revokeGithubGrant({ spaceID: 'space1' }).subscribe();
    expect(post).toHaveBeenCalledWith('ovdb/revoke_github_grant', {
      spaceID: 'space1',
    });
  });
});
