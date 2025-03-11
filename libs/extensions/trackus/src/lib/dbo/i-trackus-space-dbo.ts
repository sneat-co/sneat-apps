import { ITrackerBrief } from './i-tracker-dbo';

export interface ITrackusSpaceDbo {
	readonly trackers?: Readonly<Record<string, ITrackerBrief>>;
}
