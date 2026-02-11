export type ContactsComponentCommandName =
  | 'new_contact'
  | 'reset_selected'
  | 'select_all';

export interface ContactsComponentCommand {
  readonly name: ContactsComponentCommandName;
  readonly event: Event;
}
