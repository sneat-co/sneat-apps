import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ErrorLogger } from '@sneat/core';
import { ListService } from '../../../services/list.service';
import { of } from 'rxjs';

import { CopyListItemsPageComponent } from './copy-list-items-page.component';

describe('CopyListItemsPage', () => {
  let component: CopyListItemsPageComponent;
  let fixture: ComponentFixture<CopyListItemsPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyListItemsPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: ListService,
          useValue: {
            getListById: vi.fn(() => of(null)),
          },
        },
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: () => vi.fn(),
          },
        },
      ],
    })
      .overrideComponent(CopyListItemsPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(CopyListItemsPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
