import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { NavController } from '@ionic/angular/standalone';
import { SneatApiService } from '@sneat/api';
import { of } from 'rxjs';
import { provideLogistMocks } from '../../testing/test-utils';
import { LogistOrderService, OrderNavService } from '../../services';
import { NewSegmentPageComponent } from './new-segment-page.component';

vi.mock('@angular/fire/firestore');

describe('NewSegmentPageComponent', () => {
  let component: NewSegmentPageComponent;
  let fixture: ComponentFixture<NewSegmentPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSegmentPageComponent],
      providers: [
        ...provideLogistMocks(),
        LogistOrderService,
        OrderNavService,
        {
          provide: SneatApiService,
          useValue: {
            post: vi.fn(() => of({})),
            get: vi.fn(() => of({})),
            delete: vi.fn(() => of({})),
          },
        },
        {
          provide: Firestore,
          useValue: { type: 'Firestore', toJSON: () => ({}) },
        },
        {
          provide: NavController,
          useValue: {
            navigateForward: vi.fn(() => Promise.resolve(true)),
            navigateBack: vi.fn(() => Promise.resolve(true)),
            pop: vi.fn(() => Promise.resolve(true)),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(NewSegmentPageComponent, {
        set: {
          imports: [],
          providers: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewSegmentPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
