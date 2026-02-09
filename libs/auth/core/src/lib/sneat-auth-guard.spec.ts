import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { SneatAuthGuard } from './sneat-auth-guard';

describe('SneatAuthGuard', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				SneatAuthGuard,
				{ provide: Router, useValue: {} },
				{
					provide: Auth,
					useValue: {},
				},
			],
		});
	});

	it('should be created', () => {
		expect(TestBed.inject(SneatAuthGuard)).toBeTruthy();
	});
});
