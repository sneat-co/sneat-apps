import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UserMyProfilePageComponent } from './user-my-profile-page.component';

describe('UserMyProfilePageComponent', () => {
  let component: UserMyProfilePageComponent;
  let fixture: ComponentFixture<UserMyProfilePageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMyProfilePageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(UserMyProfilePageComponent, {
        set: { imports: [], schemas: [CUSTOM_ELEMENTS_SCHEMA] },
      })
      .compileComponents();
    fixture = TestBed.createComponent(UserMyProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default tab set to authentication', () => {
    // @ts-expect-error accessing protected member
    expect(component.tab).toBe('authentication');
  });
});
