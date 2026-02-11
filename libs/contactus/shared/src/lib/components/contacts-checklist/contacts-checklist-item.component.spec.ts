import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ContactsChecklistItemComponent } from './contacts-checklist-item.component';

describe('ContactsChecklistItemComponent', () => {
  let component: ContactsChecklistItemComponent;
  let fixture: ComponentFixture<ContactsChecklistItemComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsChecklistItemComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContactsChecklistItemComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$contact', { id: 'test', brief: {} });
    fixture.componentRef.setInput('$isLast', false);
    fixture.componentRef.setInput('$checkedInProgress', []);
    fixture.componentRef.setInput('$uncheckedInProgress', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
