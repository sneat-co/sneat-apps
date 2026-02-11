import { ISpaceItemWithBriefAndDbo } from '@sneat/core';
import {
  IContactGroupBrief,
  IContactGroupDbo,
  IMemberBrief,
  IMemberDbo,
} from '../dto';
import { ISpaceItemNavContext, Totals } from '@sneat/space-models';
import { IPerson, IPersonBrief } from '../dto';

export type IMemberContext = ISpaceItemNavContext<IMemberBrief, IMemberDbo>;
export type IPersonContext = ISpaceItemWithBriefAndDbo<IPersonBrief, IPerson>;

export type IMemberGroupContext = ISpaceItemNavContext<
  IContactGroupBrief,
  IContactGroupDbo
>;

export class Member {
  // TODO - document usage or remove
  public readonly totals: Totals;

  constructor(
    public member: IMemberContext,
    public isChecked = false,
  ) {
    this.totals = new Totals(member.dbo?.totals);
  }

  public get id(): string {
    return this.member.id;
  }

  public get title(): string {
    return this.member.brief?.title || this.member.id;
  }

  public get emoji(): string {
    return this.member.dbo?.ageGroup === 'child' ? '🧒' : '🧑';
  }
}
