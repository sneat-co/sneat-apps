import '@analogjs/vitest-angular/setup-zone';
import { TestBed } from '@angular/core/testing';
import {
	setupAngularTestingEnvironment,
	setupGlobalMocks,
} from './base-test-setup';
import { ErrorLogger } from '@sneat/logging';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';
import { AnalyticsService } from '../anaylytics/analytics.interface';

export function configureGlobalTestBed() {
	try {
		TestBed.configureTestingModule({
			providers: [
				{
					provide: ErrorLogger,
					useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
				},
				{
					provide: Firestore,
					useValue: {
						type: 'Firestore',
						toJSON: () => ({}),
					},
				},
				{
					provide: Auth,
					useValue: {
						onIdTokenChanged: vi.fn(() => () => void 0),
						onAuthStateChanged: vi.fn(() => () => void 0),
					},
				},
				{
					provide: AnalyticsService,
					useValue: {
						logEvent: vi.fn(),
						identify: vi.fn(),
						loggedOut: vi.fn(),
						setCurrentScreen: vi.fn(),
					},
				},
				{
					provide: AngularFirestore,
					useValue: {
						collection: () => ({ valueChanges: () => of([]) }),
						doc: () => ({ valueChanges: () => of(null) }),
					},
				},
				{ provide: AngularFireAuth, useValue: { authState: of(null) } },
			],
		});
	} catch (e) {
		// ignore
	}
}

export function setupTestEnvironment() {
	setupAngularTestingEnvironment();
	setupGlobalMocks();
	configureGlobalTestBed();
}
