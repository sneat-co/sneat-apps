import { ModuleSpaceItemService } from '@sneat/team-services';
import { ITrackerBrief, ITrackerDbo } from './dbo/i-tracker-dbo';

export class TrackersService extends ModuleSpaceItemService<
	ITrackerBrief,
	ITrackerDbo
> {}
