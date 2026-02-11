import { TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { UserRequiredFieldsService } from './user-required-fields.service';

describe('UserRequiredFieldsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserRequiredFieldsService,
        { provide: ModalController, useValue: { create: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(UserRequiredFieldsService)).toBeTruthy();
  });
});
