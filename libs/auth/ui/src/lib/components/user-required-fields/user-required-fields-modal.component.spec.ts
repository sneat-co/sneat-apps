import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular/standalone';
import { SneatUserService, UserRecordService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { of } from 'rxjs';
import { UserRequiredFieldsModalComponent } from './user-required-fields-modal.component';

describe('UserRequiredFieldsModalComponent', () => {
  let component: UserRequiredFieldsModalComponent;
  let fixture: ComponentFixture<UserRequiredFieldsModalComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRequiredFieldsModalComponent],
      providers: [
        { provide: ClassName, useValue: 'TestComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        { provide: ModalController, useValue: { dismiss: vi.fn() } },
        { provide: UserRecordService, useValue: { initUserRecord: vi.fn() } },
        {
          provide: SneatUserService,
          useValue: {
            userState: of({ record: undefined }),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(UserRequiredFieldsModalComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(UserRequiredFieldsModalComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
