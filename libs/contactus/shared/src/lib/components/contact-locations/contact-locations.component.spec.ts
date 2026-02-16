import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';

import { ContactLocationsComponent } from './contact-locations.component';

describe('ContactLocationsComponent', () => {
  let component: ContactLocationsComponent;
  let fixture: ComponentFixture<ContactLocationsComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactLocationsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(ContactLocationsComponent, {
        set: { imports: [], template: '' },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLocationsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('$space', { id: 'test-space' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    it('should do nothing if space is not set', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fixture.componentRef.setInput('$space', undefined as any);
      component.contact = { id: 'contact-1', brief: {} };
      
      const setSpy = vi.spyOn(component['$contactLocations'], 'set');
      
      component.ngOnChanges({
        contact: new SimpleChange(undefined, component.contact, false),
      });

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should set contactLocations when contact changes and space exists', () => {
      const space = { id: 'test-space', teamID: 'team-1' };
      fixture.componentRef.setInput('$space', space);
      component.contact = { id: 'contact-1', brief: {} };

      const setSpy = vi.spyOn(component['$contactLocations'], 'set');

      component.ngOnChanges({
        contact: new SimpleChange(undefined, component.contact, false),
      });

      expect(setSpy).toHaveBeenCalledWith([]);
    });

    it('should not update contactLocations if contact did not change', () => {
      const setSpy = vi.spyOn(component['$contactLocations'], 'set');

      component.ngOnChanges({});

      expect(setSpy).not.toHaveBeenCalled();
    });

    it('should call getContactLocations and add space to results', () => {
      const space = { id: 'test-space', teamID: 'team-1' };
      fixture.componentRef.setInput('$space', space);
      component.contact = { id: 'contact-1', brief: {} };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const getLocationsSpy = vi.spyOn(component as any, 'getContactLocations');
      getLocationsSpy.mockReturnValue([
        { id: 'loc-1', brief: { title: 'Location 1' } },
      ]);

      component.ngOnChanges({
        contact: new SimpleChange(undefined, component.contact, false),
      });

      expect(getLocationsSpy).toHaveBeenCalled();
      expect(component['$contactLocations']()).toEqual([
        { id: 'loc-1', brief: { title: 'Location 1' }, space },
      ]);
    });
  });

  describe('getContactLocations', () => {
    it('should return empty array', () => {
      const result = component['getContactLocations']();
      expect(result).toEqual([]);
    });
  });
});
