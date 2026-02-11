import { ITitledRecord } from '@sneat/dto';

export interface IReminderDbo extends ITitledRecord {
  dueOn: string;
  dueTimes?: number;
  assetId?: string;
  liabilityId?: string;
  contactIds?: string[];
  memberIds?: string[];
}
