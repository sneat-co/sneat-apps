import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ErrorLogger } from '@sneat/core';
import { ContactService } from '@sneat/contactus-services';

import { GenderFormComponent } from './gender-form.component';

describe('GenderFormComponent', () => {
  let component: GenderFormComponent;
  let fixture: ComponentFixture<MockComponent>;

  @Component({
    selector: 'sneat-mock-component',
    template:
      '<sneat-gender-form [$spaceID]="spaceID" [$contactID]="contactID" [$genderID]="genderID"/>',
    imports: [GenderFormComponent, FormsModule],
    standalone: true,
  })
  class MockComponent {
    spaceID = 'test-space';
    contactID = undefined;
    genderID = undefined;
  }

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent, FormsModule],
      providers: [
        {
          provide: ContactService,
          useValue: { updateContact: vi.fn() },
        },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
