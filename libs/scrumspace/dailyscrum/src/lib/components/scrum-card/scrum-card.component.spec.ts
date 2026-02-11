import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { NavService } from '@sneat/datatug-main';

import { ScrumCardComponent } from './scrum-card.component';

describe('ScrumCardComponent', () => {
  let component: ScrumCardComponent;
  let fixture: ComponentFixture<ScrumCardComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumCardComponent, IonicModule.forRoot()],
      providers: [
        { provide: NavController, useValue: {} },
        { provide: NavService, useValue: { navigateToMember: vi.fn() } },
      ],
    })
      .overrideComponent(ScrumCardComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ScrumCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
