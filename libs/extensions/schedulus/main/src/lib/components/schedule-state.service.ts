import { BehaviorSubject } from 'rxjs';

export interface IDateChanged {
	readonly date: Date;
	readonly shiftDirection: '' | 'back' | 'forward';
}

function diffInDays(date1: Date, date2: Date): number {
	const timeDiff = date1.getTime() - date2.getTime();
	return timeDiff / (1000 * 3600 * 24);
}

export function getToday(): Date {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}

export function addDays(d: Date, daysToAdd: number): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate() + daysToAdd);
}

export class ScheduleStateService {
	private date = getToday();
	private readonly dateChanged$ = new BehaviorSubject<IDateChanged>({
		date: this.date,
		shiftDirection: '',
	});
	public readonly dateChanged = this.dateChanged$.asObservable();

	constructor() {
		console.log('ScheduleStateService.constructor()');
	}

	public shiftDays(shiftDays: number): Date {
		console.log('ScheduleStateService.shiftDays()', shiftDays);
		const date = addDays(this.date, shiftDays);
		this.setActiveDate(date);
		return date;
	}

	public setActiveDate(date: Date): void {
		date.setHours(0, 0, 0, 0);
		const dayDifference = diffInDays(date, this.date);
		const shiftDirection =
			dayDifference == 0 ? '' : dayDifference > 0 ? 'forward' : 'back';
		this.date = date;
		this.dateChanged$.next({ date, shiftDirection });
	}

	// changeDay(shiftDays: number): void {
	// 	const d = this.date;
	// 	console.log(`changeDay(${shiftDays}) => segment=${this.tab}, activeDay.date:`, d);
	// 	if (!d) {
	// 		throw new Error('!this.activeDay.date');
	// 	}
	// 	switch (this.tab) {
	// 		case 'day':
	// 			this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
	// 			this.dayAnimationState = animationState(this.activeDayParity, shiftDays);
	// 			break;
	// 		case 'week':
	// 			this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
	// 			this.weekAnimationState = animationState(this.activeWeekParity, shiftDays);
	// 			break;
	// 		default:
	// 			return;
	// 	}
	// 	this.setDay('changeDay', new Date(d.getFullYear(), d.getMonth(), d.getDate() + shiftDays));
	// }

	setToday(): void {
		console.log('ScheduleComponent.setToday()');
		this.setActiveDate(getToday());
		// if (!this.activeDay.date) {
		// 	this.errorLogger.logError('!this.activeDay.date');
		// 	return;
		// }
		// const activeTime = this.activeDay.date.getTime();
		// switch (this.tab) {
		// 	case 'day':
		// 		this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
		// 		if (today.getTime() > activeTime) {
		// 			this.dayAnimationState = animationState(this.activeDayParity, +1);
		// 		} else if (today.getTime() < activeTime) {
		// 			this.dayAnimationState = animationState(this.activeDayParity, -1);
		// 		}
		// 		break;
		// 	case 'week':
		// 		this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
		// 		if (today.getTime() > activeTime) {
		// 			this.weekAnimationState = animationState(this.activeWeekParity, +1);
		// 		} else if (today.getTime() < activeTime) {
		// 			this.weekAnimationState = animationState(this.activeWeekParity, -1);
		// 		}
		// 		break;
		// 	default:
		// 		break;
		// }
		// this.setDay('today', today);
	}
}
