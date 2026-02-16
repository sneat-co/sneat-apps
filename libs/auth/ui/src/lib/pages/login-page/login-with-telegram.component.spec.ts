import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SneatApiService } from '@sneat/api';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { LoginWithTelegramComponent } from './login-with-telegram.component';

describe('LoginWithTelegramComponent', () => {
  let component: LoginWithTelegramComponent;
  let fixture: ComponentFixture<LoginWithTelegramComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginWithTelegramComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SneatApiService,
          useValue: { post: vi.fn(), postAsAnonymous: vi.fn() },
        },
        {
          provide: SneatAuthStateService,
          useValue: { signInWithToken: vi.fn() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(LoginWithTelegramComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(LoginWithTelegramComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
