import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DbModelPageComponent } from './db-model-page.component';

describe('DbModelPage', () => {
  let component: DbModelPageComponent;
  let fixture: ComponentFixture<DbModelPageComponent>;

  beforeEach(waitForAsync(async () => {
    // Mock history.state to prevent null access in constructor
    Object.defineProperty(window, 'history', {
      value: { ...window.history, state: { dbmodel: undefined } },
      writable: true,
      configurable: true,
    });

    await TestBed.configureTestingModule({
      imports: [DbModelPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DbModelPageComponent, {
        set: {
          imports: [],
          template: '',
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DbModelPageComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
