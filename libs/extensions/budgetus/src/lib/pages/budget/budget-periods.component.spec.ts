import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ClassName } from '@sneat/ui';
import { BudgetPeriodsComponent } from './budget-periods.component';

describe('BudgetPeriodsComponent', () => {
  let component: BudgetPeriodsComponent;
  let fixture: ComponentFixture<BudgetPeriodsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPeriodsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ClassName, useValue: 'BudgetPeriodsComponent' },
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
      ],
    })
      .overrideComponent(BudgetPeriodsComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BudgetPeriodsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.componentRef.setInput('$recurringHappenings', undefined);
    fixture.componentRef.setInput('$liabilitiesMode', 'expenses');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
