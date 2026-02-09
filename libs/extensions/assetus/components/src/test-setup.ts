import { setupTestEnvironment } from '../../../../core/src/lib/testing/test-setup';
import { TestBed } from '@angular/core/testing';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { AssetService } from './lib/services';
import {
	ToastController,
	ModalController,
	NavController,
} from '@ionic/angular/standalone';

setupTestEnvironment();

// Provide lightweight mocks for DI-heavy services used by components in this library
try {
	TestBed.configureTestingModule({
		providers: [
			{ provide: SpaceService, useValue: {} },
			{
				provide: SpaceNavService,
				useValue: {
					navigateForwardToSpacePage: vi.fn(),
					navigateToSpace: vi.fn(),
				},
			},
			{
				provide: AssetService,
				useValue: { deleteAsset: vi.fn(), createAsset: vi.fn() },
			},
			{
				provide: ToastController,
				useValue: { create: vi.fn(async () => ({ present: vi.fn() })) },
			},
			{
				provide: ModalController,
				useValue: { create: vi.fn(async () => ({ present: vi.fn() })) },
			},
			{
				provide: NavController,
				useValue: { navigateForward: vi.fn(), navigateRoot: vi.fn() },
			},
		],
	});
} catch {
	// Ignore reconfiguration errors if called multiple times across test files
}
