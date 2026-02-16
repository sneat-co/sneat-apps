import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetContactsGroupComponent } from './asset-contacts-group.component';
import { ContactType } from '@sneat/contactus-core';

describe('AssetContactsGroupComponent', () => {
  let component: AssetContactsGroupComponent;
  let fixture: ComponentFixture<AssetContactsGroupComponent>;

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetContactsGroupComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetContactsGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('title getter', () => {
    it('should return "Landlord" for landlord type', () => {
      component.contactRelation = 'landlord';
      expect(component.title).toBe('Landlord');
    });

    it('should return "Tenants" for tenant type', () => {
      component.contactRelation = 'tenant';
      expect(component.title).toBe('Tenants');
    });

    it('should return the contact relation as-is for other types', () => {
      component.contactRelation = 'owner' as ContactType;
      expect(component.title).toBe('owner');
    });

    it('should return empty string when contactRelation is undefined', () => {
      component.contactRelation = undefined;
      expect(component.title).toBe('');
    });
  });

  describe('addTitle getter', () => {
    it('should return "Add landlord" for landlord type', () => {
      component.contactRelation = 'landlord';
      expect(component.addTitle).toBe('Add landlord');
    });

    it('should return "Add tenant" for tenant type', () => {
      component.contactRelation = 'tenant';
      expect(component.addTitle).toBe('Add tenant');
    });

    it('should return "Add" prefix for other types', () => {
      component.contactRelation = 'owner' as ContactType;
      expect(component.addTitle).toBe('Addowner');
    });

    it('should return "Add" concatenated with contact relation when contactRelation is undefined', () => {
      component.contactRelation = undefined;
      expect(component.addTitle).toBe('Addundefined');
    });
  });
});
