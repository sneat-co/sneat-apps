import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ContactsAsBadgesComponent } from './contacts-as-badges.component';

describe('ContactsAsBadgesComponent', () => {
  let component: ContactsAsBadgesComponent;
  let fixture: ComponentFixture<ContactsAsBadgesComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsAsBadgesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContactsAsBadgesComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsAsBadgesComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$contacts', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
