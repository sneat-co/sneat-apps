export type WeekdayCode2 = 'mo' | 'tu' | 'we' | 'th' | 'fr' | 'sa' | 'su';
export type MonthlyMode =
	| 'monthly-day'
	| 'monthly-week-1'
	| 'monthly-week-2'
	| 'monthly-week-3'
	| 'monthly-week-4'
	| 'monthly-week-last';
export type RepeatPeriod =
	| 'UNKNOWN'
	| 'once'
	| 'daily'
	| 'weekly'
	| MonthlyMode
	| 'fortnightly'
	| 'monthly'
	| 'yearly';
export type ActivityType = 'appointment' | 'school' | 'lesson' | 'todo'; // TODO: Is it same as HappeningKind?
export type EventType = 'workshop' | 'fixture' | 'appointment';
export type ShowBy = 'event' | 'contact';
