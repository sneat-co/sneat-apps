import { ITrackerBrief } from './i-tracker-dbo';

export interface ITrackusSpaceDbo {
	readonly removedTrackers?: Readonly<Record<string, ITrackerBrief>>;
	readonly trackers?: Readonly<Record<string, ITrackerBrief>>;
}
