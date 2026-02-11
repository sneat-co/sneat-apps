import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { RandomIdService } from '@sneat/random';
import { ToastController } from '@ionic/angular/standalone';
import { ListService } from '../../../services';
import { NewListItemComponent } from './new-list-item.component';

describe('NewListItemComponent', () => {
  let component: NewListItemComponent;
  let fixture: ComponentFixture<NewListItemComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewListItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ErrorLogger,
          useValue: { logError: vi.fn(), logErrorHandler: () => vi.fn() },
        },
        {
          provide: RandomIdService,
          useValue: { newRandomId: vi.fn(() => 'abc') },
        },
        {
          provide: ToastController,
          useValue: { create: vi.fn() },
        },
        {
          provide: ListService,
          useValue: { createListItems: vi.fn() },
        },
      ],
    })
      .overrideComponent(NewListItemComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NewListItemComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
