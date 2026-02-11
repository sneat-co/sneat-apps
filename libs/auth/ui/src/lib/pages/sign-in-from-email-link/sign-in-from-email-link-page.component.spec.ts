import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavController } from '@ionic/angular/standalone';
import { SneatAuthStateService } from '@sneat/auth-core';
import { ErrorLogger } from '@sneat/core';
import { of } from 'rxjs';
import { SignInFromEmailLinkPageComponent } from './sign-in-from-email-link-page.component';

describe('SignInFromEmailLinkPageComponent', () => {
  let component: SignInFromEmailLinkPageComponent;
  let fixture: ComponentFixture<SignInFromEmailLinkPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SignInFromEmailLinkPageComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: SneatAuthStateService,
          useValue: { signInWithEmailLink: vi.fn(() => of({})) },
        },
        {
          provide: NavController,
          useValue: { navigateRoot: vi.fn(() => Promise.resolve()) },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SignInFromEmailLinkPageComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(SignInFromEmailLinkPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
