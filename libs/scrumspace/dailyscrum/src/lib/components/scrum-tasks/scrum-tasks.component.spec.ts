import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger } from '@sneat/core';
import { ScrumService } from '../../services/scrum.service';

import { ScrumTasksComponent } from './scrum-tasks.component';

describe('ScrumTasksComponent', () => {
  let component: ScrumTasksComponent;
  let fixture: ComponentFixture<ScrumTasksComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrumTasksComponent, IonicModule.forRoot()],
      providers: [
        { provide: ModalController, useValue: {} },
        { provide: ScrumService, useValue: {} },
        { provide: ErrorLogger, useValue: { logError: () => undefined } },
      ],
    })
      .overrideComponent(ScrumTasksComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ScrumTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
