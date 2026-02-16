import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { ErrorLogger } from '@sneat/core';

import { NamesFormComponent } from './names-form.component';

describe('NamesFormComponent', () => {
  let component: NamesFormComponent;
  let fixture: ComponentFixture<MockComponent>;

  @Component({
    selector: 'sneat-mock-component',
    template: '<sneat-names-form/>',
    imports: [NamesFormComponent, ReactiveFormsModule, FormsModule],
    standalone: true,
  })
  class MockComponent {}

  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [MockComponent, ReactiveFormsModule, FormsModule],
      providers: [
        {
          provide: ErrorLogger,
          useValue: {
            logError: vi.fn(),
            logErrorHandler: vi.fn(() => vi.fn()),
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.debugElement.children[0].componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('generateFullName', () => {
    it('should generate full name from first and last name', () => {
      component.firstName.setValue('John');
      component.lastName.setValue('Doe');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('John Doe');
    });

    it('should generate full name from first, middle and last name', () => {
      component.firstName.setValue('John');
      component.middleName.setValue('Michael');
      component.lastName.setValue('Doe');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('John Michael Doe');
    });

    it('should generate full name from first and middle name', () => {
      component.firstName.setValue('John');
      component.middleName.setValue('Michael');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('John Michael');
    });

    it('should generate full name from middle and last name', () => {
      component.middleName.setValue('Michael');
      component.lastName.setValue('Doe');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('Michael Doe');
    });

    it('should return empty string if only one name part is provided', () => {
      component.firstName.setValue('John');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('');
    });

    it('should handle extra whitespace', () => {
      component.firstName.setValue('  John  ');
      component.lastName.setValue('  Doe  ');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('John Doe');
    });

    it('should return empty string when all fields are empty', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fullName = (component as any).generateFullName();
      expect(fullName).toBe('');
    });
  });

  describe('names', () => {
    it('should return names object with all fields', () => {
      component.firstName.setValue('John');
      component.lastName.setValue('Doe');
      component.middleName.setValue('Michael');
      component.fullName.setValue('John Michael Doe');

      const names = component.names();
      
      expect(names.firstName).toBe('John');
      expect(names.lastName).toBe('Doe');
      expect(names.fullName).toBe('John Michael Doe');
    });

    it('should exclude empty fields', () => {
      component.firstName.setValue('John');
      component.lastName.setValue('');

      const names = component.names();
      
      expect(names.firstName).toBe('John');
      expect(names.lastName).toBeUndefined();
    });
  });

  describe('isNamesFormValid', () => {
    it('should return null when form is valid with firstName and lastName', () => {
      const formGroup = new FormGroup({
        firstName: component.firstName,
        lastName: component.lastName,
        fullName: component.fullName,
        nickName: component.nickName,
      });

      component.firstName.setValue('John');
      component.lastName.setValue('Doe');
      component.fullName.setValue('John Doe');

      const result = component.isNamesFormValid(formGroup);
      expect(result).toBeNull();
    });

    it('should return null when only fullName is provided', () => {
      const formGroup = new FormGroup({
        firstName: component.firstName,
        lastName: component.lastName,
        fullName: component.fullName,
        nickName: component.nickName,
      });

      component.fullName.setValue('John Doe');

      const result = component.isNamesFormValid(formGroup);
      expect(result).toBeNull();
    });

    it('should return null when only nickName is provided', () => {
      const formGroup = new FormGroup({
        firstName: component.firstName,
        lastName: component.lastName,
        fullName: component.fullName,
        nickName: component.nickName,
      });

      component.nickName.setValue('Johnny');

      const result = component.isNamesFormValid(formGroup);
      expect(result).toBeNull();
    });

    it('should return error when all fields are empty', () => {
      const formGroup = new FormGroup({
        firstName: component.firstName,
        lastName: component.lastName,
        fullName: component.fullName,
        nickName: component.nickName,
      });

      const result = component.isNamesFormValid(formGroup);
      expect(result).toBeTruthy();
      expect(result?.['fullName']).toContain('at least one of the following must be provided');
    });

    it('should return error when firstName and lastName are provided but fullName is missing', () => {
      const formGroup = new FormGroup({
        firstName: component.firstName,
        lastName: component.lastName,
        fullName: component.fullName,
        nickName: component.nickName,
      });

      component.firstName.setValue('John');
      component.lastName.setValue('Doe');

      const result = component.isNamesFormValid(formGroup);
      expect(result).toBeTruthy();
      expect(result?.['fullName']).toContain('full name should be supplied as well');
    });

    it('should handle whitespace in field values', () => {
      const formGroup = new FormGroup({
        firstName: component.firstName,
        lastName: component.lastName,
        fullName: component.fullName,
        nickName: component.nickName,
      });

      component.firstName.setValue('  ');
      component.lastName.setValue('  ');
      component.fullName.setValue('  ');
      component.nickName.setValue('  ');

      const result = component.isNamesFormValid(formGroup);
      expect(result).toBeTruthy();
      expect(result?.['fullName']).toContain('at least one of the following must be provided');
    });
  });
});
