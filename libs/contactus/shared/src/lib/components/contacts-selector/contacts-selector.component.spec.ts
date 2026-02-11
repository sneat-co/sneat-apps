import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ModalController } from '@ionic/angular/standalone';
import { CONTACT_ROLES_BY_TYPE } from '@sneat/app';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { ClassName, OverlayController } from '@sneat/ui';
import { of } from 'rxjs';

import { ContactsSelectorComponent } from './contacts-selector.component';

describe('ContactsSelectorComponent', () => {
  let component: ContactsSelectorComponent;
  let fixture: ComponentFixture<ContactsSelectorComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsSelectorComponent],
      providers: [
        { provide: ClassName, useValue: 'ContactsSelectorComponent' },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: OverlayController,
          useValue: { create: vi.fn(), dismiss: vi.fn() },
        },
        {
          provide: ModalController,
          useValue: { create: vi.fn(), dismiss: vi.fn() },
        },
        { provide: CONTACT_ROLES_BY_TYPE, useValue: {} },
        {
          provide: ContactusSpaceService,
          useValue: { watchContactBriefs: vi.fn(() => of([])) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContactsSelectorComponent, {
        set: { imports: [], template: '', providers: [] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsSelectorComponent);
    component = fixture.componentInstance;
    component.space = { id: 'test-space' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
