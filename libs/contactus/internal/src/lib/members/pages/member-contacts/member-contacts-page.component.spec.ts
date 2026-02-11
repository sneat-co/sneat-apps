import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberContactsPageComponent } from './member-contacts-page.component';
import { provideContactusMocks } from '../../../testing/test-utils';

describe('MemberContactsPage', () => {
  let component: MemberContactsPageComponent;
  let fixture: ComponentFixture<MemberContactsPageComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberContactsPageComponent],
      providers: [provideContactusMocks()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(MemberContactsPageComponent, {
        set: { imports: [], providers: [] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberContactsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
