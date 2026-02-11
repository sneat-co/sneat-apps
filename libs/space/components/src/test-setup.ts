import { setupTestEnvironment } from '@sneat/core/testing';
import { TestBed } from '@angular/core/testing';
import { SpaceNavService, SpaceService } from '@sneat/space-services';
import { NavController } from '@ionic/angular/standalone';

setupTestEnvironment();

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
        provide: NavController,
        useValue: { navigateForward: vi.fn(), navigateRoot: vi.fn() },
      },
    ],
  });
} catch {
  // ignore if configured already
}
