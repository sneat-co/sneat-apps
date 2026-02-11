import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { ListDialogsService } from './ListDialogs.service';

describe('ListDialogsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        ListDialogsService,
        { provide: ModalController, useValue: { create: vi.fn() } },
      ],
    }),
  );

  it('should be created', () => {
    expect(TestBed.inject(ListDialogsService)).toBeTruthy();
  });
});
