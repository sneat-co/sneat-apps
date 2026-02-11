import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { CalendariumSpaceService } from './calendarium-space.service';

vi.mock('@angular/fire/firestore');

describe('CalendariumSpaceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendariumSpaceService,
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(CalendariumSpaceService)).toBeTruthy();
  });
});
