import { describe, it, expect } from 'vitest';
import {
  validateContactRequest,
  validateUpdateContactRequest,
  validateSetContactsRequest,
  IContactRequest,
  IUpdateContactRequest,
  ISetContactsStatusRequest,
} from './contact';

describe('Contact DTO Validators', () => {
  describe('validateContactRequest', () => {
    it('should pass validation with valid request', () => {
      const request: IContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
      };

      expect(() => validateContactRequest(request)).not.toThrow();
    });

    it('should throw error if spaceID is missing', () => {
      const request = {
        spaceID: '',
        contactID: 'contact1',
      } as IContactRequest;

      expect(() => validateContactRequest(request)).toThrow(
        'spaceID parameters is required',
      );
    });

    it('should throw error if contactID is missing', () => {
      const request = {
        spaceID: 'space1',
        contactID: '',
      } as IContactRequest;

      expect(() => validateContactRequest(request)).toThrow(
        'contactID is required parameter',
      );
    });

    it('should throw error if both are missing', () => {
      const request = {
        spaceID: '',
        contactID: '',
      } as IContactRequest;

      expect(() => validateContactRequest(request)).toThrow('spaceID');
    });
  });

  describe('validateUpdateContactRequest', () => {
    it('should pass validation with address update', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
        address: {
          lines: ['123 Main St'],
          city: 'New York',
          countryID: 'US',
        },
      };

      expect(() => validateUpdateContactRequest(request)).not.toThrow();
    });

    it('should pass validation with names update', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
        names: {
          firstName: 'John',
          lastName: 'Doe',
        },
      };

      expect(() => validateUpdateContactRequest(request)).not.toThrow();
    });

    it('should pass validation with ageGroup update', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
        ageGroup: 'adult' as unknown,
      };

      expect(() => validateUpdateContactRequest(request)).not.toThrow();
    });

    it('should pass validation with gender update', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
        gender: 'male',
      };

      expect(() => validateUpdateContactRequest(request)).not.toThrow();
    });

    it('should pass validation with vatNumber update', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
        vatNumber: 'VAT123456',
      };

      expect(() => validateUpdateContactRequest(request)).not.toThrow();
    });

    it('should pass validation with dateOfBirth update', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
        dateOfBirth: '1990-01-01',
      };

      expect(() => validateUpdateContactRequest(request)).not.toThrow();
    });

    it('should throw error if no update fields provided', () => {
      const request: IUpdateContactRequest = {
        spaceID: 'space1',
        contactID: 'contact1',
      };

      expect(() => validateUpdateContactRequest(request)).toThrow(
        'At least one of the following is required',
      );
    });

    it('should throw error if spaceID is missing', () => {
      const request = {
        spaceID: '',
        contactID: 'contact1',
        names: { firstName: 'John' },
      } as IUpdateContactRequest;

      expect(() => validateUpdateContactRequest(request)).toThrow('spaceID');
    });

    it('should throw error if contactID is missing', () => {
      const request = {
        spaceID: 'space1',
        contactID: '',
        names: { firstName: 'John' },
      } as IUpdateContactRequest;

      expect(() => validateUpdateContactRequest(request)).toThrow('contactID');
    });
  });

  describe('validateSetContactsRequest', () => {
    it('should pass validation with valid request', () => {
      const request: ISetContactsStatusRequest = {
        spaceID: 'space1',
        status: 'active',
        contactIDs: ['contact1', 'contact2'],
      };

      expect(() => validateSetContactsRequest(request)).not.toThrow();
    });

    it('should pass validation with archived status', () => {
      const request: ISetContactsStatusRequest = {
        spaceID: 'space1',
        status: 'archived',
        contactIDs: ['contact1'],
      };

      expect(() => validateSetContactsRequest(request)).not.toThrow();
    });

    it('should throw error if spaceID is missing', () => {
      const request = {
        spaceID: '',
        status: 'active',
        contactIDs: ['contact1'],
      } as ISetContactsStatusRequest;

      expect(() => validateSetContactsRequest(request)).toThrow(
        'spaceID parameters is required',
      );
    });

    it('should throw error if contactIDs is empty', () => {
      const request: ISetContactsStatusRequest = {
        spaceID: 'space1',
        status: 'active',
        contactIDs: [],
      };

      expect(() => validateSetContactsRequest(request)).toThrow(
        'contactIDs is required parameter',
      );
    });

    it('should throw error if both are invalid', () => {
      const request = {
        spaceID: '',
        status: 'active',
        contactIDs: [],
      } as ISetContactsStatusRequest;

      expect(() => validateSetContactsRequest(request)).toThrow('spaceID');
    });
  });
});
