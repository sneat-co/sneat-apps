import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SneatUserService } from '@sneat/auth-core';
import { Subject, of } from 'rxjs';

import { UserSpaceBriefProvider } from './user-space-brief.provider';

describe('UserSpaceBriefProvider', () => {
	it('should create', () => {
		const destroyed$ = new Subject<void>();
		const $spaceID = signal('test-space');
		const mockUserService = {
			userState: of({ record: { spaces: {} } }),
			userChanged: of(undefined),
		} as unknown as SneatUserService;

		const provider = new UserSpaceBriefProvider(
			destroyed$.asObservable(),
			$spaceID,
			mockUserService,
		);

		expect(provider).toBeTruthy();
		destroyed$.next();
		destroyed$.complete();
	});
});
