import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SneatErrorCardComponent } from './sneat-error-card.component';

describe('SneatErrorCardComponent', () => {
  let component: SneatErrorCardComponent;
  let fixture: ComponentFixture<SneatErrorCardComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [SneatErrorCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(SneatErrorCardComponent, {
        set: {
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SneatErrorCardComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept error with message', () => {
    const error = { message: 'Test error message' };
    component.error = error;
    expect(component.error).toBe(error);
    expect(component.error.message).toBe('Test error message');
  });

  it('should accept error without message', () => {
    const error = {};
    component.error = error;
    expect(component.error).toBe(error);
    expect(component.error.message).toBeUndefined();
  });

  it('should handle undefined error', () => {
    component.error = undefined;
    expect(component.error).toBeUndefined();
  });
});
