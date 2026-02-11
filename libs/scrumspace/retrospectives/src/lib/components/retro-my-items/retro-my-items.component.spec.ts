import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ErrorLogger } from '@sneat/core';
import { RetrospectiveService } from '../../retrospective.service';

import { RetroMyItemsComponent } from './retro-my-items.component';

describe('RetroMyItemsComponent', () => {
  let component: RetroMyItemsComponent;
  let fixture: ComponentFixture<RetroMyItemsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [RetroMyItemsComponent, IonicModule.forRoot()],
      providers: [
        {
          provide: RetrospectiveService,
          useValue: { addRetroItem: vi.fn(), deleteRetroItem: vi.fn() },
        },
        { provide: ErrorLogger, useValue: { logError: vi.fn() } },
      ],
    })
      .overrideComponent(RetroMyItemsComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RetroMyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
