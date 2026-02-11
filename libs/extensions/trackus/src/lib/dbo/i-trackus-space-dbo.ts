import { ITrackerBrief } from './i-tracker-dbo';

export interface ITrackusSpaceDbo {
  readonly archivedTrackers?: Readonly<Record<string, ITrackerBrief>>;
  readonly trackers?: Readonly<Record<string, ITrackerBrief>>;
}
