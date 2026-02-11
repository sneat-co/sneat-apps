import { CalendarSpace } from './calendar-space';
import { CalendariumSpaceService } from './calendarium-space.service';
import { of } from 'rxjs';

describe('CalendarSpace', () => {
  it('should create', () => {
    const mockCalendariumSpaceService = {
      watchSpaceModuleRecord: vi.fn(() => of({ id: 'test', dbo: null })),
    } as unknown as CalendariumSpaceService;
    const calendarSpace = new CalendarSpace(
      'test-space',
      mockCalendariumSpaceService,
    );
    expect(calendarSpace).toBeTruthy();
    calendarSpace.destroy();
  });
});
