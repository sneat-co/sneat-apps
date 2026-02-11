import { SpaceMemberType } from '@sneat/auth-models';
import { IFormField } from '@sneat/core';

export const ContactTypePerson = 'person',
  ContactTypeCompany = 'company',
  ContactTypeLocation = 'location',
  ContactTypeAnimal = 'animal',
  ContactTypeVehicle = 'vehicle';

export type ContactType =
  | SpaceMemberType
  | typeof ContactTypePerson
  | typeof ContactTypeCompany
  | typeof ContactTypeLocation
  | typeof ContactTypeAnimal
  | typeof ContactTypeVehicle
  | 'landlord'
  | 'tenant';
export type MemberContactType =
  | typeof ContactTypePerson
  | typeof ContactTypeAnimal;

export interface IEmail {
  readonly type: 'work' | 'personal';
  readonly address: string;
}

export interface IPhone {
  readonly type: 'work' | 'mobile' | 'personal' | 'fax';
  readonly number: string;
}

export interface IPersonRequirements {
  readonly lastName?: IFormField;
  readonly ageGroup?: IFormField;
  readonly gender?: IFormField;
  readonly phone?: IFormField;
  readonly email?: IFormField;
  readonly relatedAs?: IFormField;
  readonly roles?: IFormField;
}
