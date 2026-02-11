import {
  ContactGroupWithIdAndBrief,
  IContactRoleWithIdAndBrief,
} from '@sneat/contactus-core';

export interface IContactAddEventArgs {
  event: Event;
  group?: ContactGroupWithIdAndBrief;
  role?: IContactRoleWithIdAndBrief;
}
