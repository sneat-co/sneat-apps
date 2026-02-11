import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ErrorLogger } from '@sneat/core';
import { RetrospectiveService } from '../../retrospective.service';

import { AddRetroItemComponent } from './add-retro-item.component';

describe('AddRetroItemComponent', () => {
  let component: AddRetroItemComponent;
  let fixture: ComponentFixture<AddRetroItemComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRetroItemComponent, IonicModule.forRoot()],
      providers: [
        { provide: RetrospectiveService, useValue: { addRetroItem: vi.fn() } },
        { provide: ErrorLogger, useValue: { logError: vi.fn() } },
      ],
    })
      .overrideComponent(AddRetroItemComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AddRetroItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
