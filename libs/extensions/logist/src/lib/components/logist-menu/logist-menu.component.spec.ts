import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogistMenuComponent } from './logist-menu.component';

describe('LogistMenuComponent', () => {
  let component: LogistMenuComponent;
  let fixture: ComponentFixture<LogistMenuComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [LogistMenuComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(LogistMenuComponent, {
        set: { imports: [], providers: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LogistMenuComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
