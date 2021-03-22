import {IUser} from '@sneat/auth-models';


// export interface IRecord<T> { // TODO: duplicate name
//   id: string;
//   state?: RecordState;
//   data?: T;
// }

export interface IDatatugUser extends IUser {
  dataTug?: IDataTugBriefForUser;
  dataTugProjects?: IDatatugProjectBrief[];
}

export interface IDataTugBriefForUser {
  stores?: IDataTugStoreBrief[];
  projects?: IDatatugProjectBrief[];
}

export interface IDataTugStoreBrief {
  title: string;
  type: DataTugProjStoreType;
  url: string;
}

export type DataTugProjStoreType = 'agent' | 'local' | 'github.com';

export interface IDatatugProjStoreBrief {
  type: DataTugProjStoreType;
  url?: string;
}

export interface IDatatugProjectBrief {
  readonly id: string;
  readonly store: IDatatugProjStoreBrief;
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

