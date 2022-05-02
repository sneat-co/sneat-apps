import {
	VirtualSliderAnimationStates,
	VirtualSliderDirectPushedNext,
	VirtualSliderDirectPushedPrev,
	VirtualSliderReversePushedNext,
	VirtualSliderReversePushedPrev,
	wdCodeToWeekdayLongName,
} from '@sneat/components';
import { WeekdayCode2 } from '@sneat/dto';
import { wd2 } from '../view-models';
import { Weekday } from './schedule-week/schedule-week.component';
import { Parity } from './swipeable-ui';

export function isToday(date: Date): boolean {
	const today = new Date();
	return date.getDate() === today.getDate() &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear();
}

export function isTomorrow(date: Date): boolean {
	const today = new Date();
	return date.getDate() === today.getDate() + 1 &&
		date.getMonth() === today.getMonth() &&
		date.getFullYear() === today.getFullYear();
}

export function getWdDate(wd: WeekdayCode2, activeWd: WeekdayCode2, activeDate: Date): Date {
	if (wd === activeWd) {
		return activeDate;
	}
	const wdIndex = wd2.indexOf(wd);
	const dayIndex = wd2.indexOf(activeWd);
	return new Date(
		activeDate.getFullYear(),
		activeDate.getMonth(),
		activeDate.getDate() + wdIndex - dayIndex,
	);
}


export const SHIFT_1_DAY = 1, SHIFT_1_WEEK = 7;

export interface Week {
	startDate: Date; // e.g. Monday
	endDate: Date; // e.g. Sunday
}

export const createWeekdays = (): Weekday[] => wd2.map(
	id => ({ id, longTitle: wdCodeToWeekdayLongName(id) }));

export function animationState(activeParity: Parity, direction: 'forward' | 'back'): VirtualSliderAnimationStates {
	let result: VirtualSliderAnimationStates;
	switch (activeParity) {
		case 'odd':
			switch (direction) {
				case 'forward':
					result = VirtualSliderReversePushedNext;
					break;
				case 'back':
					result = VirtualSliderDirectPushedPrev;
					break;
				default:
					throw new Error(`Invalid direction: ${direction}`);
			}
			break;
		case 'even':
			switch (direction) {
				case 'forward':
					result = VirtualSliderDirectPushedNext;
					break;
				case 'back':
					result = VirtualSliderReversePushedPrev;
					break;
				default:
					throw new Error(`Invalid direction: ${direction}`);
			}
			break;
		default:
			throw new Error(`Unknown parity: ${activeParity}`);
	}
	console.log(`animationState(${activeParity}): ${result}`);
	return result;
}
