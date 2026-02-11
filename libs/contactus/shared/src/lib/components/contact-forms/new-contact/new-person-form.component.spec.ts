import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { SpaceNavService } from '@sneat/space-services';
import {
  ContactGroupService,
  ContactRoleService,
  ContactService,
} from '@sneat/contactus-services';
import { AssetService } from '@sneat/ext-assetus-components';

import { NewPersonFormComponent } from './new-person-form.component';

describe('NewPersonFormComponent', () => {
  let component: NewPersonFormComponent;
  let fixture: ComponentFixture<NewPersonFormComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPersonFormComponent],
      providers: [
        { provide: ClassName, useValue: 'NewContactFormComponent' },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
        {
          provide: SpaceNavService,
          useValue: { navigateForwardToSpacePage: vi.fn() },
        },
        {
          provide: ContactService,
          useValue: { createContact: vi.fn(), watchContactById: vi.fn() },
        },
        {
          provide: ContactGroupService,
          useValue: { getContactGroupByID: vi.fn() },
        },
        {
          provide: ContactRoleService,
          useValue: { getContactRoleByID: vi.fn() },
        },
        { provide: AssetService, useValue: { watchAssetByID: vi.fn() } },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(NewPersonFormComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$contact', {
      id: '',
      space: { id: 'test-space' },
      dbo: { type: 'person' },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
