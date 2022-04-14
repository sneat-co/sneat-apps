import {
	VirtualSlideAnimationsStates,
	VirtualSliderAnimationStates,
	VirtualSliderDirectPushedNext,
	VirtualSliderDirectPushedPrev,
	VirtualSliderReversePushedNext,
	VirtualSliderReversePushedPrev,
	wdCodeToWeekdayName,
} from '@sneat/components';
import { getWeekdayDate } from '@sneat/core';
import { Weekday } from '@sneat/dto';
import { SlotsGroup, wd2 } from '../../view-models';

export function getWdDate(wd: Weekday, activeWd: Weekday, activeDate: Date): Date {
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

export function setWeekStartAndEndDates(week: Week, activeDate: Date): void {
	console.log('setWeekRange', activeDate, week);
	week.startDate = getWeekdayDate(activeDate, 0);
	// tslint:disable-next-line:no-magic-numbers
	week.endDate = getWeekdayDate(activeDate, 6);
}

export type ScheduleTab = 'day' | 'week' | 'regular' | 'events';

export type Parity = 'odd' | 'even';

export const SHIFT_1_DAY = 1, SHIFT_1_WEEK = 7;

interface Swipeable {
	animationState: VirtualSlideAnimationsStates;
	readonly parity: Parity;
}

export interface Day extends Swipeable {
	date?: Date;
	weekday?: SlotsGroup;
}

export interface Week extends Swipeable {
	weekdays: SlotsGroup[];
	startDate?: Date; // e.g. Monday
	endDate?: Date; // e.g. Sunday
}

export const createWeekdays = (): SlotsGroup[] => wd2.map(
	wd => ({ wd, title: wdCodeToWeekdayName(wd), slots: [] }));

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
