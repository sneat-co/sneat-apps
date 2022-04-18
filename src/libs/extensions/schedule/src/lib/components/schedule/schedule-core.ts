import {
	VirtualSliderAnimationStates,
	VirtualSliderDirectPushedNext,
	VirtualSliderDirectPushedPrev,
	VirtualSliderReversePushedNext,
	VirtualSliderReversePushedPrev,
	wdCodeToWeekdayLongName,
} from '@sneat/components';
import { getWeekdayDate } from '@sneat/core';
import { WeekdayCode2 } from '@sneat/dto';
import { wd2 } from '../../view-models';
import { Weekday } from '../schedule-week/schedule-week.component';
import { Parity, Swipeable } from './swipeable-ui';

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

export function setWeekStartAndEndDates(week: SwipeableWeek, activeDate: Date): void {
	console.log('setWeekRange', activeDate, week);
	week.startDate = getWeekdayDate(activeDate, 0);
	// tslint:disable-next-line:no-magic-numbers
	week.endDate = getWeekdayDate(activeDate, 6);
}

export type ScheduleTab = 'day' | 'week' | 'recurrings' | 'singles';

export const SHIFT_1_DAY = 1, SHIFT_1_WEEK = 7;

export interface SwipeableWeek extends Swipeable {
	startDate?: Date; // e.g. Monday
	endDate?: Date; // e.g. Sunday
}

export const createWeekdays = (): Weekday[] => wd2.map(
	id => ({ id, longTitle: wdCodeToWeekdayLongName(id) }));

export function animationState(activeParity: Parity, diff: number): VirtualSliderAnimationStates {
	let result: VirtualSliderAnimationStates;
	switch (activeParity) {
		case 'odd':
			if (diff > 0) {
				result = VirtualSliderReversePushedNext;
			} else if (diff < 0) {
				result = VirtualSliderDirectPushedPrev;
			} else {
				throw new Error(`Invalid v: ${diff}`);
			}
			break;
		case 'even':
			if (diff > 0) {
				result = VirtualSliderDirectPushedNext;
			} else if (diff < 0) {
				result = VirtualSliderReversePushedPrev;
			} else {
				throw new Error(`Invalid v: ${diff}`);
			}
			break;
		default:
			throw new Error(`Unknown parity: ${activeParity}`);
	}
	console.log(`animationState(${activeParity}): ${result}`);
	return result;
}
