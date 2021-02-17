import {animate, style, transition, trigger} from '@angular/animations';

export const listAddRemoveAnimation: any[] = [
	trigger('addRemove', [
		transition(':leave', [
			animate('0.2s  ease-in-out', style({height: 0})),
		]),
	]),
];
