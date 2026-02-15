import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BetaFlagsComponent } from './beta-flags.component';
import { SneatUserService } from '@sneat/auth-core';
import { of } from 'rxjs';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';

describe('BetaFlagsComponent', () => {
  let component: BetaFlagsComponent;
  let fixture: ComponentFixture<BetaFlagsComponent>;
  let userServiceMock: { userState: import('rxjs').Observable<any> };

  beforeEach(async () => {
    userServiceMock = {
      userState: of({ record: { id: 'test-user', dbo: { beta: true } } }),
    };

    await TestBed.configureTestingModule({
      imports: [BetaFlagsComponent],
      providers: [
        { provide: SneatUserService, useValue: userServiceMock },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: vi.fn() },
        },
        { provide: ClassName, useValue: 'BetaFlagsComponent' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BetaFlagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set user record from user service', () => {
    // @ts-expect-error accessing protected member for test
    expect(component.$userRecord()).toEqual({
      id: 'test-user',
      dbo: { beta: true },
    });
  });
});
