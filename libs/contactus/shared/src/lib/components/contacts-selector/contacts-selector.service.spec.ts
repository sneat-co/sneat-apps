import { TestBed } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ModalController } from '@ionic/angular/standalone';

import { ContactsSelectorService } from './contacts-selector.service';
import { IContactSelectorOptions } from './contacts-selector.interfaces';

describe('ContactsSelectorService', () => {
  let service: ContactsSelectorService;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContactsSelectorService,
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: ModalController,
          useValue: {
            create: vi.fn().mockResolvedValue({
              present: vi.fn(),
              onDidDismiss: vi.fn().mockResolvedValue({ data: [] }),
            }),
            dismiss: vi.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(ContactsSelectorService);
    modalController = TestBed.inject(ModalController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call selectMultipleInModal when selectMultipleContacts is called', async () => {
    const options: IContactSelectorOptions = {
      mode: 'multi',
      items: [],
    };

    const selectMultipleInModalSpy = vi.spyOn(
      service as any,
      'selectMultipleInModal',
    );
    selectMultipleInModalSpy.mockResolvedValue([]);

    await service.selectMultipleContacts(options);

    expect(selectMultipleInModalSpy).toHaveBeenCalledWith(options);
  });
});
