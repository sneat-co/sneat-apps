import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { NewHappeningPageComponent } from './new-happening-page.component';
import { provideSchedulusMocks } from '../../testing/test-utils';

describe('NewHappeningPage', () => {
  let component: NewHappeningPageComponent;
  let fixture: ComponentFixture<NewHappeningPageComponent>;

  beforeEach(() => {
    window.history.replaceState({}, '', window.location.href);
  });

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [NewHappeningPageComponent],
      providers: [provideRouter([]), ...provideSchedulusMocks()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(NewHappeningPageComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHappeningPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
