import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IRelatedItem } from '@sneat/dto';

import { RelatedAsComponent } from './related-as.component';

describe('RelatedAsComponent', () => {
  let component: RelatedAsComponent;
  let fixture: ComponentFixture<RelatedAsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedAsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(RelatedAsComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedAsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$spaceRef', { id: 'test-space' });
    fixture.componentRef.setInput('$itemID', 'test-item');
    fixture.componentRef.setInput('$moduleID', 'contactus');
    fixture.componentRef.setInput('$collectionID', 'contacts');
    fixture.componentRef.setInput('$relatedTo', { title: 'Test', related: {} });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute spaceID from spaceRef', () => {
    expect(component['$spaceID']()).toBe('test-space');
  });

  it('should compute relatedTitle from relatedTo', () => {
    fixture.componentRef.setInput('$relatedTo', {
      title: 'Related Contact',
      related: {},
    });
    expect(component.$relatedTitle()).toBe('Related Contact');
  });

  it('should compute relatedItemsOfRelatedItem from relatedTo', () => {
    const related = { 'contactus/contacts/space1/item1': {} };
    fixture.componentRef.setInput('$relatedTo', {
      title: 'Test',
      related,
    });
    expect(component.$relatedItemsOfRelatedItem()).toBe(related);
  });

  it('should return undefined for relatedAsRoles when no related items', () => {
    fixture.componentRef.setInput('$relatedTo', {
      title: 'Test',
      related: {},
    });
    expect(component['$relatedAsRoles']()).toBeUndefined();
  });

  it('should return roles when related item has rolesOfItem', () => {
    const relatedItem: IRelatedItem = {
      rolesOfItem: {
        parent: { created: { by: 'user1', at: 0 } },
        guardian: { created: { by: 'user1', at: 0 } },
      },
    };
    const related = {
      contactus: {
        contacts: {
          'test-item': relatedItem,
        },
      },
    };
    fixture.componentRef.setInput('$relatedTo', {
      title: 'Test',
      related,
    });

    const roles = component['$relatedAsRoles']();
    expect(roles).toEqual(['parent', 'guardian']);
  });

  it('should return undefined when relatedItem has no rolesOfItem', () => {
    const relatedItem: IRelatedItem = {};
    const related = {
      contactus: {
        contacts: {
          'test-item': relatedItem,
        },
      },
    };
    fixture.componentRef.setInput('$relatedTo', {
      title: 'Test',
      related,
    });

    expect(component['$relatedAsRoles']()).toBeUndefined();
  });

  it('should handle different module and collection IDs', () => {
    fixture.componentRef.setInput('$moduleID', 'schedule');
    fixture.componentRef.setInput('$collectionID', 'events');
    fixture.componentRef.setInput('$itemID', 'event-123');

    const relatedItem: IRelatedItem = {
      rolesOfItem: {
        organizer: { created: { by: 'user1', at: 0 } },
      },
    };
    const related = {
      schedule: {
        events: {
          'event-123': relatedItem,
        },
      },
    };
    fixture.componentRef.setInput('$relatedTo', {
      title: 'Test Event',
      related,
    });

    const roles = component['$relatedAsRoles']();
    expect(roles).toEqual(['organizer']);
  });
});
