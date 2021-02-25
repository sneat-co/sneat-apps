import {IUser} from '@sneat/auth-models';


// export interface IRecord<T> { // TODO: duplicate name
//   id: string;
//   state?: RecordState;
//   data?: T;
// }

export interface IDataTugUser extends IUser {
  dataTug?: IDataTugBriefForUser;
  dataTugProjects?: IDataTugProjectBrief[];
}

export interface IDataTugBriefForUser {
  stores: IDataTugStoreBrief[];
  projects: IDataTugProjectBrief[];
}

export interface IDataTugStoreBrief {
  title: string;
  type: DataTugProjStoreType;
  url: string;
}

export type DataTugProjStoreType = 'agent' | 'local' | 'github.com';

export interface IDataTugProjStoreBrief {
  type: DataTugProjStoreType;
  url?: string;
}

export interface IDataTugProjectBrief {
  readonly id: string;
  readonly store: IDataTugProjStoreBrief;
  readonly title?: string;
  readonly titleOverride?: string;
}

export type MetricColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning';

export interface IBoolMetricVal {
  label: string;
  color: MetricColor;
}

export interface IBoolMetric {
  true: IBoolMetricVal;
  false: IBoolMetricVal;
}





interface IInvite {
  message?: string;
}

interface IPerson {
  title: string;
  email: string;
}

export interface IPersonalInvite extends IInvite {
  channel: string;
  address: string;
  team: { id: string; title: string };
  memberId: string;
  from: IPerson;
  to: IPerson;
}

