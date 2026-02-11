import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { HappeningSlotModalService } from './happening-slot-modal.service';

describe('HappeningSlotModalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HappeningSlotModalService,
        { provide: ModalController, useValue: { create: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(HappeningSlotModalService)).toBeTruthy();
  });
});
