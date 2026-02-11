import { IIdAndBrief } from '@sneat/core';

export interface IContactGroupBrief {
  readonly emoji?: string;
  readonly title: string;
}

export type ContactGroupWithIdAndBrief = IIdAndBrief<IContactGroupBrief>;
