import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRequiredComponent } from './login-required.component';

describe('LoginRequiredComponentComponent', () => {
  let component: LoginRequiredComponent;
  let fixture: ComponentFixture<LoginRequiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRequiredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRequiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
