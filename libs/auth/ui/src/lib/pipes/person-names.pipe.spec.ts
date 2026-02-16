import { PersonNamesPipe, personNames } from './person-names.pipe';
import { IPersonNames } from '@sneat/auth-models';

describe('PersonNamesPipe', () => {
  let pipe: PersonNamesPipe;

  beforeEach(() => {
    pipe = new PersonNamesPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform', () => {
    it('should return undefined when names is undefined', () => {
      const result = pipe.transform(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined when names is null', () => {
      const result = pipe.transform(undefined);
      expect(result).toBeUndefined();
    });

    it('should return fullName when it exists', () => {
      const names: IPersonNames = { fullName: 'John Michael Doe' };
      const result = pipe.transform(names);
      expect(result).toBe('John Michael Doe');
    });

    it('should prefer fullName over other name fields', () => {
      const names: IPersonNames = {
        fullName: 'John Michael Doe',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
        nickName: 'Johnny',
      };
      const result = pipe.transform(names);
      expect(result).toBe('John Michael Doe');
    });

    it('should return firstName + lastName when both exist and fullName is not provided', () => {
      const names: IPersonNames = {
        firstName: 'John',
        lastName: 'Doe',
      };
      const result = pipe.transform(names);
      expect(result).toBe('John Doe');
    });

    it('should return firstName + lastName when both exist along with other fields but no fullName', () => {
      const names: IPersonNames = {
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
        nickName: 'Johnny',
      };
      const result = pipe.transform(names);
      expect(result).toBe('John Doe');
    });

    it('should return JSON.stringify when only firstName exists', () => {
      const names: IPersonNames = { firstName: 'John' };
      const result = pipe.transform(names);
      expect(result).toBe(JSON.stringify(names));
      expect(result).toBe('{"firstName":"John"}');
    });

    it('should return JSON.stringify when only lastName exists', () => {
      const names: IPersonNames = { lastName: 'Doe' };
      const result = pipe.transform(names);
      expect(result).toBe(JSON.stringify(names));
      expect(result).toBe('{"lastName":"Doe"}');
    });

    it('should return JSON.stringify when only middleName exists', () => {
      const names: IPersonNames = { middleName: 'Michael' };
      const result = pipe.transform(names);
      expect(result).toBe(JSON.stringify(names));
      expect(result).toBe('{"middleName":"Michael"}');
    });

    it('should return JSON.stringify when only nickName exists', () => {
      const names: IPersonNames = { nickName: 'Johnny' };
      const result = pipe.transform(names);
      expect(result).toBe(JSON.stringify(names));
      expect(result).toBe('{"nickName":"Johnny"}');
    });

    it('should return JSON.stringify for empty object', () => {
      const names: IPersonNames = {};
      const result = pipe.transform(names);
      expect(result).toBe('{}');
    });

    it('should handle empty strings in firstName and lastName', () => {
      const names: IPersonNames = {
        firstName: '',
        lastName: '',
      };
      const result = pipe.transform(names);
      expect(result).toBe(JSON.stringify(names));
    });

    it('should handle whitespace-only firstName and lastName', () => {
      const names: IPersonNames = {
        firstName: '   ',
        lastName: '   ',
      };
      const result = pipe.transform(names);
      // Since '   ' is truthy, this should combine them with a space in between
      expect(result).toBe('       '); // '   ' + ' ' + '   ' = 7 spaces
    });
  });
});

describe('personNames function', () => {
  it('should return undefined when names is undefined', () => {
    const result = personNames(undefined);
    expect(result).toBeUndefined();
  });

  it('should return fullName when it exists', () => {
    const names: IPersonNames = { fullName: 'John Michael Doe' };
    const result = personNames(names);
    expect(result).toBe('John Michael Doe');
  });

  it('should prefer fullName over all other fields', () => {
    const names: IPersonNames = {
      fullName: 'John Michael Doe',
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
      nickName: 'Johnny',
    };
    const result = personNames(names);
    expect(result).toBe('John Michael Doe');
  });

  it('should return firstName + lastName when both exist and no nickName or middleName', () => {
    const names: IPersonNames = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const result = personNames(names);
    expect(result).toBe('John Doe');
  });

  it('should return nickName when firstName and lastName exist along with nickName', () => {
    const names: IPersonNames = {
      firstName: 'John',
      lastName: 'Doe',
      nickName: 'Johnny',
    };
    const result = personNames(names);
    expect(result).toBe('Johnny');
  });

  it('should return nickName when firstName and lastName exist along with middleName', () => {
    const names: IPersonNames = {
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
    };
    const result = personNames(names);
    expect(result).toBe('John');
  });

  it('should return nickName as first priority when available', () => {
    const names: IPersonNames = {
      nickName: 'Johnny',
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
    };
    const result = personNames(names);
    expect(result).toBe('Johnny');
  });

  it('should return firstName when only firstName is available', () => {
    const names: IPersonNames = { firstName: 'John' };
    const result = personNames(names);
    expect(result).toBe('John');
  });

  it('should return firstName when nickName is not available but firstName is', () => {
    const names: IPersonNames = {
      firstName: 'John',
      lastName: 'Doe',
      middleName: 'Michael',
    };
    const result = personNames(names);
    expect(result).toBe('John');
  });

  it('should return lastName when only lastName is available', () => {
    const names: IPersonNames = { lastName: 'Doe' };
    const result = personNames(names);
    expect(result).toBe('Doe');
  });

  it('should return lastName when nickName and firstName are not available', () => {
    const names: IPersonNames = {
      lastName: 'Doe',
      middleName: 'Michael',
    };
    const result = personNames(names);
    expect(result).toBe('Doe');
  });

  it('should return middleName when only middleName is available', () => {
    const names: IPersonNames = { middleName: 'Michael' };
    const result = personNames(names);
    expect(result).toBe('Michael');
  });

  it('should return middleName as last priority', () => {
    const names: IPersonNames = {
      middleName: 'Michael',
    };
    const result = personNames(names);
    expect(result).toBe('Michael');
  });

  it('should return undefined for empty object', () => {
    const names: IPersonNames = {};
    const result = personNames(names);
    expect(result).toBeUndefined();
  });

  it('should handle empty strings and return undefined', () => {
    const names: IPersonNames = {
      firstName: '',
      lastName: '',
      middleName: '',
      nickName: '',
      fullName: '',
    };
    const result = personNames(names);
    // Empty strings are falsy in the OR chain
    expect(result).toBe('');
  });

  it('should prioritize nickName over firstName', () => {
    const names: IPersonNames = {
      nickName: 'JD',
      firstName: 'John',
    };
    const result = personNames(names);
    expect(result).toBe('JD');
  });

  it('should return firstName + lastName when nickName is empty string', () => {
    const names: IPersonNames = {
      firstName: 'John',
      lastName: 'Doe',
      nickName: '',
    };
    const result = personNames(names);
    // Empty string is falsy, and no middleName, so firstName + lastName is used
    expect(result).toBe('John Doe');
  });

  it('should prioritize lastName over middleName', () => {
    const names: IPersonNames = {
      lastName: 'Doe',
      middleName: 'Michael',
    };
    const result = personNames(names);
    expect(result).toBe('Doe');
  });

  describe('edge cases', () => {
    it('should handle all fields with nickName priority', () => {
      const names: IPersonNames = {
        fullName: '',
        nickName: 'Johnny',
        firstName: 'John',
        lastName: 'Doe',
        middleName: 'Michael',
      };
      const result = personNames(names);
      expect(result).toBe('Johnny');
    });

    it('should handle whitespace-only fullName as falsy', () => {
      const names: IPersonNames = {
        fullName: '   ',
        firstName: 'John',
      };
      const result = personNames(names);
      // '   ' is truthy, so fullName should be returned
      expect(result).toBe('   ');
    });

    it('should handle special characters in names', () => {
      const names: IPersonNames = {
        firstName: "O'Brien",
        lastName: 'Smith-Jones',
      };
      const result = personNames(names);
      expect(result).toBe("O'Brien Smith-Jones");
    });

    it('should handle unicode characters', () => {
      const names: IPersonNames = {
        firstName: '张',
        lastName: '伟',
      };
      const result = personNames(names);
      expect(result).toBe('张 伟');
    });
  });
});
