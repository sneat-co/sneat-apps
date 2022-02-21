import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRequiredComponentComponent } from './login-required-component.component';

describe('LoginRequiredComponentComponent', () => {
  let component: LoginRequiredComponentComponent;
  let fixture: ComponentFixture<LoginRequiredComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRequiredComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRequiredComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
