import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavController } from '@ionic/angular/standalone';
import { Subject } from 'rxjs';
import { SneatNavService } from './sneat-nav.service';

describe('SneatNavService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SneatNavService,
        {
          provide: Router,
          useValue: { events: new Subject() },
        },
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: NavController, useValue: { pop: vi.fn() } },
      ],
    });
  });

  it('should be created', () => {
    expect(TestBed.inject(SneatNavService)).toBeTruthy();
  });
});
