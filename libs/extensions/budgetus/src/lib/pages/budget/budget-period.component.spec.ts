import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BudgetPeriodComponent } from './budget-period.component';

describe('BudgetPeriodComponent', () => {
  let component: BudgetPeriodComponent;
  let fixture: ComponentFixture<BudgetPeriodComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetPeriodComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(BudgetPeriodComponent, {
        set: { imports: [], template: '', schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BudgetPeriodComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('activePeriod', 'weekly');
    fixture.componentRef.setInput('$showBy', 'event');
    fixture.componentRef.setInput('$period', 'weekly');
    fixture.componentRef.setInput('$liabilitiesMode', 'expenses');
  }));

  const c = () => component as unknown as Record<string, any>;

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('aggregates per-currency totals from the period liabilities effect', () => {
    fixture.componentRef.setInput('liabilitiesByPeriod', {
      weekly: {
        happenings: [
          { valuesByCurrency: { EUR: 10, USD: 5 }, happening: { id: 'h1' } },
          { valuesByCurrency: { EUR: 20 }, happening: { id: 'h2' } },
        ],
        contacts: [],
      },
    });
    fixture.detectChanges();

    const totals = c()['totalToBePaid']() as {
      currency: string;
      value: number;
    }[];
    const eur = totals.find((t) => t.currency === 'EUR');
    const usd = totals.find((t) => t.currency === 'USD');
    expect(eur?.value).toBe(30);
    expect(usd?.value).toBe(5);
    expect(c()['periodLiabilities']).toBeDefined();
  });

  it('leaves periodLiabilities undefined when the period has no entry', () => {
    fixture.componentRef.setInput('liabilitiesByPeriod', {
      monthly: undefined,
    });
    fixture.detectChanges();
    expect(c()['periodLiabilities']).toBeUndefined();
  });

  it('getAmounts flattens valuesByCurrency into amounts', () => {
    const amounts = c()['getAmounts']({ valuesByCurrency: { EUR: 7, USD: 3 } });
    expect(amounts).toEqual([
      { currency: 'EUR', value: 7 },
      { currency: 'USD', value: 3 },
    ]);
  });

  it('changeShowBy stops the event, emits, and returns false', () => {
    const emit = vi.spyOn(component.showByChange, 'emit');
    const event = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn(),
    } as unknown as Event;
    const result = c()['changeShowBy']('contact', event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
    expect(emit).toHaveBeenCalledWith('contact');
    expect(result).toBe(false);
  });
});
