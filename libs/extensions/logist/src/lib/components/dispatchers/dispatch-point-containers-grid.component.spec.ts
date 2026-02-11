import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DispatchPointContainersGridComponent } from './dispatch-point-containers-grid.component';

describe('DispatchPointContainersGridComponent', () => {
  let component: DispatchPointContainersGridComponent;
  let fixture: ComponentFixture<DispatchPointContainersGridComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [DispatchPointContainersGridComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(DispatchPointContainersGridComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DispatchPointContainersGridComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
