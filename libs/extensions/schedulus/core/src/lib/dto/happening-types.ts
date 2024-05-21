export type WeekdayCode2 = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';
export type MonthlyWeek =
	| 'monthly-1st-week'
	| 'monthly-2nd-week'
	| 'monthly-3d-week'
	| 'monthly-4th-week'
	| 'week-last-week';
export type RepeatPeriod =
	| 'UNKNOWN'
	| 'once'
	| 'daily'
	| 'weekly'
	| MonthlyWeek
	| 'fortnightly'
	| 'monthly'
	| 'yearly';
export type ActivityType = 'appointment' | 'school' | 'lesson' | 'todo'; // TODO: Is it same as HappeningKind?
export type EventType = 'workshop' | 'fixture' | 'appointment';
export type ShowBy = 'event' | 'contact';
