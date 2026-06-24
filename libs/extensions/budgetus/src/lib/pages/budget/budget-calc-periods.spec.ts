import {
  ICalendarHappeningBrief,
  IHappeningSlot,
} from '@sneat/extension-calendarius-contract';
import { ISpaceContext } from '@sneat/space-models';
import { getLiabilitiesByPeriod } from './budget-calc-periods';

const space = { id: 'space1' } as ISpaceContext;

// Minimal happening-brief factory: one slot + an optional price list.
function happening(
  slot: Partial<IHappeningSlot>,
  prices?: { value: number; currency: string; expenseQuantity?: number }[],
  related?: Record<string, unknown>,
): ICalendarHappeningBrief {
  return {
    title: 'h',
    slots: { slot1: slot as IHappeningSlot },
    prices: prices?.map((p, i) => ({
      id: `p${i}`,
      term: { type: 'recurring' },
      amount: { value: p.value, currency: p.currency },
      expenseQuantity: p.expenseQuantity ?? 1,
    })),
    related,
  } as unknown as ICalendarHappeningBrief;
}

describe('getLiabilitiesByPeriod', () => {
  it('returns an empty map for no happenings', () => {
    const result = getLiabilitiesByPeriod('expenses', {}, space);
    expect(result).toEqual({});
  });

  it('ignores slots that are neither weekly nor monthly', () => {
    const recurring = {
      h1: happening({ repeats: 'daily' }, [{ value: 10, currency: 'EUR' }]),
    };
    const result = getLiabilitiesByPeriod('expenses', recurring, space);
    expect(result).toEqual({});
  });

  it('aggregates a weekly expense with weekdays into the weekly period', () => {
    const recurring = {
      h1: happening({ repeats: 'weekly', weekdays: ['mo', 'tu'] }, [
        { value: 10, currency: 'EUR' },
      ]),
    };
    const result = getLiabilitiesByPeriod('expenses', recurring, space);
    expect(result.weekly).toBeDefined();
    expect(result.weekly?.happenings.length).toBe(1);
    const liab = result.weekly?.happenings[0];
    // 2 weekdays x 10 = 20
    expect(liab?.valuesByCurrency['EUR']).toBe(20);
    expect(liab?.times).toBe(2);
  });

  it('filters out negative-amount prices in expenses mode', () => {
    const recurring = {
      h1: happening({ repeats: 'weekly', weekdays: ['mo'] }, [
        { value: -10, currency: 'EUR' },
      ]),
    };
    const result = getLiabilitiesByPeriod('expenses', recurring, space);
    // The weekly bucket is created for the slot, but the negative price is
    // filtered out so no happening liability is recorded.
    expect(result.weekly?.happenings.length).toBe(0);
  });

  it('keeps only negative-amount prices in incomes mode', () => {
    const recurring = {
      h1: happening({ repeats: 'weekly', weekdays: ['mo'] }, [
        { value: -10, currency: 'EUR' },
        { value: 5, currency: 'EUR' },
      ]),
    };
    const result = getLiabilitiesByPeriod('incomes', recurring, space);
    expect(result.weekly?.happenings.length).toBe(1);
    expect(result.weekly?.happenings[0].valuesByCurrency['EUR']).toBe(-10);
  });

  it('keeps both positive and negative prices in balance mode', () => {
    const recurring = {
      h1: happening({ repeats: 'weekly', weekdays: ['mo'] }, [
        { value: -10, currency: 'EUR' },
        { value: 5, currency: 'EUR' },
      ]),
    };
    const result = getLiabilitiesByPeriod('balance', recurring, space);
    // -10 + 5 = -5 over one weekday
    expect(result.weekly?.happenings[0].valuesByCurrency['EUR']).toBe(-5);
  });

  it('records a monthly happening under the monthly period', () => {
    const recurring = {
      h1: happening({ repeats: 'monthly' }, [{ value: 30, currency: 'EUR' }]),
    };
    const result = getLiabilitiesByPeriod('expenses', recurring, space);
    // monthly slots have no weekday loop, so the happening is recorded without
    // currency accumulation.
    expect(result.monthly).toBeDefined();
    expect(result.monthly?.happenings.length).toBe(1);
  });

  it('processes a weekly happening that carries related contacts', () => {
    const recurring = {
      h1: happening(
        { repeats: 'weekly', weekdays: ['mo'] },
        [{ value: 10, currency: 'EUR' }],
        { contactus: { contacts: { c1: { title: 'C1' } } } },
      ),
    };
    const result = getLiabilitiesByPeriod('expenses', recurring, space);
    // The happening liability is still aggregated regardless of related contacts.
    expect(result.weekly?.happenings[0].valuesByCurrency['EUR']).toBe(10);
  });

  it('creates an empty weekly bucket when no prices qualify', () => {
    const recurring = {
      h1: happening({ repeats: 'weekly', weekdays: ['mo'] }, []),
    };
    const result = getLiabilitiesByPeriod('expenses', recurring, space);
    expect(result.weekly?.happenings.length).toBe(0);
  });
});
