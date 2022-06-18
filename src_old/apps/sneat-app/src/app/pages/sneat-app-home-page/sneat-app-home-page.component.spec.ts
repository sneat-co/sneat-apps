import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SneatAppHomePageComponent } from './sneat-app-home-page.component';

describe('SneatAppHomePageComponent', () => {
  let component: SneatAppHomePageComponent;
  let fixture: ComponentFixture<SneatAppHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SneatAppHomePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SneatAppHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
