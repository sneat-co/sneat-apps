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

  describe('$isDisabled', () => {
    it('should return false when contact is not in progress arrays', () => {
      fixture.componentRef.setInput('$contact', { id: 'contact-1', brief: {} });
      fixture.componentRef.setInput('$checkedInProgress', []);
      fixture.componentRef.setInput('$uncheckedInProgress', []);

      expect(component['$isDisabled']()).toBe(false);
    });

    it('should return true when contact is in checkedInProgress', () => {
      fixture.componentRef.setInput('$contact', { id: 'contact-1', brief: {} });
      fixture.componentRef.setInput('$checkedInProgress', ['contact-1']);
      fixture.componentRef.setInput('$uncheckedInProgress', []);

      expect(component['$isDisabled']()).toBe(true);
    });

    it('should return true when contact is in uncheckedInProgress', () => {
      fixture.componentRef.setInput('$contact', { id: 'contact-1', brief: {} });
      fixture.componentRef.setInput('$checkedInProgress', []);
      fixture.componentRef.setInput('$uncheckedInProgress', ['contact-1']);

      expect(component['$isDisabled']()).toBe(true);
    });

    it('should return true when contact is in both progress arrays', () => {
      fixture.componentRef.setInput('$contact', { id: 'contact-1', brief: {} });
      fixture.componentRef.setInput('$checkedInProgress', ['contact-1']);
      fixture.componentRef.setInput('$uncheckedInProgress', ['contact-1']);

      expect(component['$isDisabled']()).toBe(true);
    });

    it('should return false when only other contacts are in progress', () => {
      fixture.componentRef.setInput('$contact', { id: 'contact-1', brief: {} });
      fixture.componentRef.setInput('$checkedInProgress', ['contact-2', 'contact-3']);
      fixture.componentRef.setInput('$uncheckedInProgress', ['contact-4']);

      expect(component['$isDisabled']()).toBe(false);
    });
  });

  describe('onCheckboxChange', () => {
    it('should emit checkboxChange event with contact and event', () => {
      const contact = { id: 'contact-1', brief: { title: 'Test Contact' } };
      const mockEvent = new Event('change');
      
      vi.spyOn(component.checkboxChange, 'emit');

      component['onCheckboxChange'](mockEvent, contact);

      expect(component.checkboxChange.emit).toHaveBeenCalledWith({
        event: mockEvent,
        item: contact,
      });
    });

    it('should emit with different contacts', () => {
      const contact1 = { id: 'contact-1', brief: { title: 'Contact 1' } };
      const contact2 = { id: 'contact-2', brief: { title: 'Contact 2' } };
      const mockEvent1 = new Event('change');
      const mockEvent2 = new Event('change');
      
      vi.spyOn(component.checkboxChange, 'emit');

      component['onCheckboxChange'](mockEvent1, contact1);
      component['onCheckboxChange'](mockEvent2, contact2);

      expect(component.checkboxChange.emit).toHaveBeenCalledTimes(2);
      expect(component.checkboxChange.emit).toHaveBeenNthCalledWith(1, {
        event: mockEvent1,
        item: contact1,
      });
      expect(component.checkboxChange.emit).toHaveBeenNthCalledWith(2, {
        event: mockEvent2,
        item: contact2,
      });
    });
  });
});
