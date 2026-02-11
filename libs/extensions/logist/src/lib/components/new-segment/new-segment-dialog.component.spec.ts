import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalController, NavController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { OrderNavService } from '../../services';
import { NewSegmentDialogComponent } from './new-segment-dialog.component';

describe('NewSegmentDialogComponent', () => {
  let component: NewSegmentDialogComponent;
  let fixture: ComponentFixture<NewSegmentDialogComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewSegmentDialogComponent],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: ModalController,
          useValue: { dismiss: vi.fn(() => Promise.resolve()) },
        },
        OrderNavService,
        {
          provide: NavController,
          useValue: {
            navigateForward: vi.fn(() => Promise.resolve(true)),
            navigateBack: vi.fn(() => Promise.resolve(true)),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(NewSegmentDialogComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewSegmentDialogComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
