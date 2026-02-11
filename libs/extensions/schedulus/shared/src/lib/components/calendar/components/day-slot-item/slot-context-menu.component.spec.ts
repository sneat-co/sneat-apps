import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ContactsSelectorService } from '@sneat/contactus-shared';
import { SpaceNavService } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { PopoverController } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { HappeningService } from '../../../../services/happening.service';
import { HappeningSlotModalService } from '../../../happening-slot-form/happening-slot-modal.service';
import { SlotContextMenuComponent } from './slot-context-menu.component';

describe('SlotContextMenuComponent', () => {
  let component: SlotContextMenuComponent;
  let fixture: ComponentFixture<SlotContextMenuComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SlotContextMenuComponent],
      providers: [
        { provide: ClassName, useValue: 'SlotContextMenuComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: PopoverController,
          useValue: { dismiss: vi.fn(() => Promise.resolve()) },
        },
        {
          provide: HappeningService,
          useValue: {
            deleteSlot: vi.fn(() => of({})),
            cancelHappening: vi.fn(() => of({})),
            revokeHappeningCancellation: vi.fn(() => of({})),
            cancelAdjustment: vi.fn(() => of({})),
            addParticipant: vi.fn(() => of(undefined)),
            removeParticipant: vi.fn(() => of(undefined)),
          },
        },
        {
          provide: HappeningSlotModalService,
          useValue: { editSingleHappeningSlot: vi.fn(() => Promise.resolve()) },
        },
        {
          provide: ContactsSelectorService,
          useValue: { selectMultipleContacts: vi.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SlotContextMenuComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA], template: '' },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SlotContextMenuComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
