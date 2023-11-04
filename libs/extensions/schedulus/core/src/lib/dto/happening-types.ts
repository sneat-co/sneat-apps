export type WeekdayCode2 = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';
export type RepeatsWeek =
	| 'week-1st'
	| 'week-2nd'
	| 'week-3d'
	| 'week-4th'
	| 'week-last';
export type Repeats =
	| 'UNKNOWN'
	| 'once'
	| 'weekly'
	| RepeatsWeek
	| 'fortnightly'
	| 'monthly'
	| 'yearly';
export type ActivityType = 'appointment' | 'school' | 'lesson' | 'todo'; // TODO: Is it same as HappeningKind?
export type EventType = 'workshop' | 'fixture' | 'appointment';
