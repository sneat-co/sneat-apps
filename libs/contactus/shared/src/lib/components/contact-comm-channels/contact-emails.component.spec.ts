import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { ContactService } from '@sneat/contactus-services';

import { ContactEmailsComponent } from './contact-emails.component';

describe('ContactEmailsComponent', () => {
  let component: ContactEmailsComponent;
  let fixture: ComponentFixture<ContactEmailsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactEmailsComponent],
      providers: [
        { provide: ClassName, useValue: 'ContactEmailsComponent' },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: ContactService,
          useValue: { addContactCommChannel: vi.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContactEmailsComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactEmailsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$contact', {
      id: 'test',
      space: { id: 'test-space' },
      dbo: {},
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
