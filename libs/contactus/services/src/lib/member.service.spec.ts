import { TestBed } from '@angular/core/testing';
import { SpaceService } from '@sneat/space-services';
import { MemberService } from './member.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { ContactusSpaceService } from './contactus-space.service';
import { SneatUserService } from '@sneat/auth-core';

vi.mock('@angular/fire/firestore', async (importOriginal) => {
	const actual = await importOriginal<any>();
	return {
		...actual,
		collection: vi.fn().mockReturnValue({}),
	};
});

describe('MemberService', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				MemberService,
				{ provide: SpaceService, useValue: { team$: of() } },
				{ provide: Firestore, useValue: { type: 'firestore' } },
				{ provide: SneatApiService, useValue: {} },
				{ provide: ContactusSpaceService, useValue: {} },
				{ provide: SneatUserService, useValue: {} },
			],
		}),
	);

	it('should be created', () => {
		const service: MemberService = TestBed.inject(MemberService);
		expect(service).toBeTruthy();
	});
});
