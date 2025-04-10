import {
	VirtualSliderAnimationStates,
	VirtualSliderDirectPushedNext,
	VirtualSliderDirectPushedPrev,
	VirtualSliderReversePushedNext,
	VirtualSliderReversePushedPrev,
} from '@sneat/components';
import {
	wd2,
	wdCodeToWeekdayLongName,
	WeekdayCode2,
} from '@sneat/mod-schedulus-core';
import { addDays } from './calendar/calendar-state.service';
import { Weekday } from './calendar/weekday';
import { Parity } from './swipeable-ui';

export function isToday(date: Date): boolean {
	return areSameDates(date, new Date());
}

export function isTomorrow(date?: Date): boolean {
	if (!date) {
		return false;
	}
	const tomorrow = addDays(new Date(), 1);
	return areSameDates(date, tomorrow);
}

export function areSameDates(d1: Date, d2: Date): boolean {
	return (
		d1.getDate() === d2.getDate() &&
		d1.getMonth() === d2.getMonth() &&
		d1.getFullYear() === d2.getFullYear()
	);
}

export function getWdDate(
	wd: WeekdayCode2,
	activeWd: WeekdayCode2,
	activeDate: Date,
): Date {
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

export const SHIFT_1_DAY = 1,
	SHIFT_1_WEEK = 7;

export const createWeekdays = (): Weekday[] =>
	wd2.map((id) => ({
		id,
		day: undefined,
		longTitle: wdCodeToWeekdayLongName(id),
	}));

export function animationState(
	activeParity: Parity,
	direction: 'forward' | 'back',
): VirtualSliderAnimationStates {
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
